# WARNING: This is a generated file
# You can edit it for prototyping, but please submit changes to the corresponding file in src/py

# Dev system. This script watches changes and recompiles the bundler and rebundles the script
# This script won't work outside of the repo
# Output is also hosted on your local computer, which can be used for integration testing with the engine side

# Usage: py gdev-watch.py <inputPath> [<port>]
# Output: bundle.json, bundler.js, bundle.raw.json
# If port is not specified, default port is 2222

# === common.py ===

import yaml
import dukpy
import sys
import os
import json
import time
import logging
from watchdog.observers import Observer
from watchdog.events import FileSystemEventHandler
import http.server
import socketserver

# constants
BUNDLE_JSON = "bundle.json"
BUNDLE_RAW_JSON = "bundle.raw.json"
BUNDLER_JS = "bundler.js"

# Http stuff
class HostHandler(http.server.SimpleHTTPRequestHandler):
    def translate_path(self,path):
        return BUNDLE_JSON
    def end_headers(self):
        self.send_header('Access-Control-Allow-Origin', '*')
        super(HostHandler, self).end_headers()

def host_loop(port):
    with socketserver.TCPServer(("", port), HostHandler) as httpd:
        print(f"Hosting {BUNDLE_JSON} at localhost:" + str(port))
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("Stopping...")

# Watcher Stuff
class Handler(FileSystemEventHandler):
    def __init__(self, inputFile, rebuildFunc):
        self.inputFile = inputFile
        self.rebuildFunc = rebuildFunc
    def on_any_event(self, event):
        if event.src_path.endswith(".yaml") or event.src_path.endswith(".ts"):
            print(f"Rebuilding... {self.inputFile}")
            self.rebuildFunc(self.inputFile)

def watch_start(inputFile, rebuildFunc):
    event_handler = Handler(inputFile, rebuildFunc)
    observer = Observer()
    observer.schedule(event_handler, ".", recursive=True)
    observer.start()
    print("Start watching changes")
    return observer

def watch_loop():
    while True:
        try:
            time.sleep(1)
        except KeyboardInterrupt:
            print("Stopping...")  
            break
    
def watch_stop(observer):
    observer.stop()
    print("Stopped watching for changes")
    observer.join()

# Load Yaml Stuff
def rebundleHelper(inputPath, doEmitRaw, isCompact, bundleFunc):
    obj = {}
    try:
        loadYamlPath(inputPath, obj)
        if doEmitRaw:
            with open(BUNDLE_RAW_JSON, "w+") as out:
                json.dump(obj, out, indent=4)
                
            print(f"Emitted {BUNDLE_RAW_JSON}")

        bundled = bundleFunc(obj)

        with open(BUNDLE_JSON, "w+") as out:
            if isCompact:
                json.dump(bundled, out, separators=(',', ':'))
            else:
                json.dump(bundled, out, indent=4)
        print(f"Emitted {BUNDLE_JSON}")
    except:
        logging.exception("")
        print("Failed to bundle")

def loadYamlPath(yamlPath, obj):
    if os.path.isfile(yamlPath) and yamlPath.endswith(".yaml"):
        obj.update(loadYamlFile(yamlPath))
    elif os.path.isdir(yamlPath):
        for subpath in os.listdir(yamlPath):
            loadYamlPath(os.path.join(yamlPath, subpath), obj)


def loadYamlFile(yamlFile):
    print(f"Loading {yamlFile}")
    with open(yamlFile, "r") as f:
        return yaml.load(f, Loader=yaml.FullLoader)

def tscompileAndInvokeBundler(obj):
    print("Compiling...")
    bundlerJs=""
    for tsSourceName in ["version.ts", "type.ts", "switch.ts", "RouteScriptBundler.ts"]:
        with open(f'src/ts/{tsSourceName}', "r") as tsSrc:
            print(f"Compiling... {tsSourceName}")
            bundlerJs += f"/// {tsSourceName}\n"
            bundlerJs += dukpy.typescript_compile("".join(line for line in tsSrc)  )
    with open(BUNDLER_JS, "w+") as bundlerOut:
        bundlerOut.write(bundlerJs)
        print(f"Emitted {BUNDLER_JS}")

    with open('src/js/system.js', "r") as systemSrc:
        systemJs = " ".join(line for line in systemSrc)

    with open('src/js/invoke.js', "r") as invokeSrc:
        invokeJs = " ".join(line for line in invokeSrc)
    return dukpy.evaljs([systemJs, bundlerJs, invokeJs], input=obj)

# === common.py ===
def __main__():
    if len(sys.argv) < 2:
        print(f"Usage: {sys.argv[0]} <input> [<port>]")
        sys.exit(1)

    inputFile = sys.argv[1]
    port = 2222

    if len(sys.argv) > 2:
        port = int(sys.argv[2])
    else:
        print(f"Using default port {port}")
    print(f"Building... {inputFile}")
    rebuildBundle(inputFile)

    observer = watch_start(inputFile, rebuildBundle)
    host_loop(port)
    watch_stop(observer)


def rebuildBundle(inputFile):
    rebundleHelper(inputFile, True, False, tscompileAndInvokeBundler)

__main__()
