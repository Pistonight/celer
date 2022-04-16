#!/usr/bin/python3
"""Main script to generate code based on game data"""

from os.path import isdir, isfile, join
from scripts.generator import CodeGenerator
import os
import shutil
import sys
import toml
from scripts.evalcore import eval_codegen
from scripts.common import md5

if not isdir("build"):
    os.mkdir("build")

# Load config
with open("config.toml", "r", encoding="utf-8") as config_file:
    # filename => {target?, dependencies?, generate?}
    config = toml.load(config_file)

# filename => {source_hash?, target?}
build_map = {}
if isfile("build/map.toml"):
    with open("build/map.toml", "r", encoding="utf-8") as map_file:
        build_map = toml.load(map_file)

# Check if config has changed
CONFIG_CHANGED = True
CONFIG_HASH = md5("config.toml")
if "config.toml" in build_map:
    if "source_hash" in build_map["config.toml"]:
        CONFIG_CHANGED = build_map["config.toml"]["source_hash"] != CONFIG_HASH

# file => hash
source_hashes = {}
def hash_source(file_to_check):
    """Hash and memoize the file src/{file}"""
    if file_to_check not in source_hashes:
        source_hashes[file_to_check] = md5(f"src/{file_to_check}")
    return source_hashes[file_to_check]

# filename => {source_hash, target?}
new_build_map = {}

need_rebuild = {}
SKIP_COUNT = 0
# pylint: disable-next=too-many-return-statements
def needs_rebuild(file_to_check):
    """Check if a file needs rebuilding"""
    # pylint: disable-next=global-statement
    global SKIP_COUNT
    if CONFIG_CHANGED:
        return True
    # Check memoized result
    if file_to_check in need_rebuild:
        return need_rebuild[file_to_check]
    # Check if file is mananged by generator
    if file_to_check not in config:
        # Check if hash match
        if file_to_check in build_map and \
            "source_hash" in build_map[file_to_check] and \
            build_map[file_to_check]["source_hash"] == hash_source(file_to_check):

            need_rebuild[file_to_check] = False
            print(f"SKIP {file_to_check}")
            SKIP_COUNT += 1
            new_build_map[file_to_check] = {}
            new_build_map[file_to_check]["source_hash"] = build_map[file_to_check]["source_hash"]
            return False
        need_rebuild[file_to_check] = True
        return True
    if "dependencies" in config[file_to_check]:
        # check if dependencies needs rebuilding
        deps = config[file_to_check]["dependencies"]
        for dependency in deps:
            if needs_rebuild(dependency):
                need_rebuild[file_to_check] = True
                return True

    # Check if file was built
    if file_to_check not in build_map:
        need_rebuild[file_to_check] = True
        return True

    if "generate" in config[file_to_check]:
        # If "generate" exists, file is generated from config, no need to check source
        need_rebuild[file_to_check] = False
        return False

    # Check if hash match
    if "source_hash" in build_map[file_to_check] and \
        build_map[file_to_check]["source_hash"] == hash_source(file_to_check):

        need_rebuild[file_to_check] = False
        return False

    need_rebuild[file_to_check] = True
    return True


def build(file_to_build, dep_level=0):
    """Build the file if needed"""

    if not needs_rebuild(file_to_build):
        return
    if file_to_build in new_build_map:
        return
    spaces = " " * (dep_level*2)
    if file_to_build not in config:
        # Compute hash but no processing
        print(f"{spaces}HASH {file_to_build}")
        new_build_map[file_to_build] = {}
        new_build_map[file_to_build]["source_hash"] = hash_source(file_to_build)
        return

    print(f"{spaces}BUILD {file_to_build}")
    # Ensure dependencies are built
    for dependency in config[file_to_build]["dependencies"]:
        build(dependency, dep_level+1)
    # Build self
    do_build(file_to_build)
    new_build_map[file_to_build] = {}
    if "generate" not in config[file_to_build]:
        new_build_map[file_to_build]["source_hash"] = hash_source(file_to_build)
    if "target" in config[file_to_build]:
        new_build_map[file_to_build]["target"] = config[file_to_build]["target"]

def do_build(file_to_build):
    "Generate the file"
    # Resolve dependencies
    dependencies = \
        list(map(lambda f: \
            f"build/{f}" if (f in config) else f"src/{f}", \
            config[file_to_build]["dependencies"]))

    if "generate" in config[file_to_build]:
        content = eval_codegen(config[file_to_build]["generate"], dependencies)
        with open(f"build/{file_to_build}", "w+", encoding="utf-8") as out_file:
            out_file.write(content)
    else:
        with open(join("src", file_to_build), "r", encoding="utf-8") as src_file:
            with open(join("build", file_to_build), "w+", encoding="utf-8") as out_file:
                codegen = CodeGenerator(src_file, out_file)
                codegen.build()
                # for line in src_file:
                #     start = line.find("CODEGEN_START")
                #     if start != -1:
                #         end = line.find("CODEGEN_END")
                #         if end != -1:
                #             code = line[start+len("CODEGEN_START"):end]
                #             result = eval_codegen(code, dependencies)
                #             new_line = line[:start] + result + line[end+len("CODEGEN_END"):]
                #             out_file.write(new_line)
                #             continue

                #     out_file.write(line)



# Copy over files that don't need rebuild
for file in config:
    if not needs_rebuild(file):
        print(f"SKIP {file}")
        SKIP_COUNT+=1
        new_build_map[file] = {}
        if "source_hash" in build_map[file]:
            new_build_map[file]["source_hash"] = build_map[file]["source_hash"]
        if "target" in config[file]:
            new_build_map[file]["target"] = config[file]["target"]

# Build rest
for file in config:
    build(file)

APPLY_COUNT = 0
BUILD_COUNT = len(new_build_map)
# config
new_build_map["config.toml"] = {"source_hash": CONFIG_HASH}

# Write map.toml
with open("build/map.toml", "w+", encoding="utf-8") as new_map_file:
    toml.dump(new_build_map, new_map_file)

if len(sys.argv) > 1 and sys.argv[1] == "apply":
    for file, file_config in new_build_map.items():
        if "target" in file_config:
            APPLY_COUNT+=1
            target = file_config["target"]
            shutil.copyfile(join("build", file), target)
            print(f"APPLY {file} => {target}")
else:
    print("Add \"apply\" in argument to apply the generated files to their targets")
print("")
print(f"{BUILD_COUNT} Processed, {SKIP_COUNT} Skipped, {APPLY_COUNT} Applied")
