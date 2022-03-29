# This is a standalone bundle & watch system. You can use this script by itself
# The output is a minimized JSON, which can be distributed
# Output is also hosted on your local computer, which can be used for integration testing with the engine side

# Usage: py gbundle.py <inputPath> [<port>]
# Output: bundle.json
# If port is not specified, default port is 2222

# PY_INJECT

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
    print(f"Bundling... {inputFile}")
    rebuildBundle(inputFile)

    observer = watch_start(inputFile, rebuildBundle)
    host_loop(port)
    watch_stop(observer)

def rebuildBundle(inputFile):
    rebundleHelper(inputFile, False, True, invokeJsBundle)

def invokeJsBundle(obj):
# JS_INJECT_NEXT_LINE
    return dukpy.evaljs("JS_INJECT", input=obj)

__main__()
