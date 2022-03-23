#!/usr/bin/python3

from importlib.util import source_hash
import os
import shutil
import sys
import toml
from scripts.evalcore import eval_codegen
from os.path import isdir, isfile, join
from scripts.common import md5

if not isdir("build"):
    os.mkdir("build")

# Load config
with open("config.toml", "r") as config_file:
    # filename => {target?, dependencies?, generate?}
    config = toml.load(config_file)

# filename => {source_hash?, target?}
build_map = {}
if isfile("build/map.toml"):
    with open("build/map.toml", "r") as map_file:
        build_map = toml.load(map_file)

# Check if config has changed
config_changed = True
config_hash = md5("config.toml")
if "config.toml" in build_map:
    if "source_hash" in build_map["config.toml"]:
        config_changed = build_map["config.toml"]["source_hash"] != config_hash

# file => hash
source_hashes = {}
def hash_source(file):
    if file not in source_hashes:
        source_hashes[file] = md5(f"src/{file}")
    return source_hashes[file]

# filename => {source_hash, target?}
new_build_map = {}

need_rebuild = {}
skip_count = 0
def needs_rebuild(file):
    global skip_count
    if config_changed:
        return True
    # Check memoized result
    if file in need_rebuild:
        return need_rebuild[file]
    # Check if file is mananged by generator
    if file not in config:
        # Check if hash match
        if file in build_map and "source_hash" in build_map[file] and build_map[file]["source_hash"] == hash_source(file):
            need_rebuild[file] = False
            print(f"SKIP {file}")
            skip_count += 1
            new_build_map[file] = {}
            new_build_map[file]["source_hash"] = build_map[file]["source_hash"]
            return False
        need_rebuild[file] = True
        return True
    if "dependencies" in config[file]:
        # check if dependencies needs rebuilding
        deps = config[file]["dependencies"]
        for dependency in deps:
            if needs_rebuild(dependency):
                need_rebuild[file] = True
                return True
            
    # Check if file was built
    if file not in build_map:
        need_rebuild[file] = True
        return True
    
    if "generate" in config[file]:
        # If "generate" exists, file is generated from config, no need to check source
        need_rebuild[file] = False
        return False
    
    # Check if hash match
    if "source_hash" in build_map[file] and build_map[file]["source_hash"] == hash_source(file):
        need_rebuild[file] = False
        return False

    need_rebuild[file] = True
    return True


def build(file, dep_level=0):
    
    if not needs_rebuild(file):
        return
    if file in new_build_map:
        return
    spaces = " " * (dep_level*2)
    if file not in config:
        # Compute hash but no processing
        print(f"{spaces}HASH {file}")
        new_build_map[file] = {}
        new_build_map[file]["source_hash"] = hash_source(file)
        return
    
    print(f"{spaces}BUILD {file}")
    # Ensure dependencies are built
    for dependency in config[file]["dependencies"]:
        build(dependency, dep_level+1)
    # Build self
    do_build(file)
    new_build_map[file] = {}
    if "generate" not in config[file]:
        new_build_map[file]["source_hash"] = hash_source(file)
    if "target" in config[file]:
        new_build_map[file]["target"] = config[file]["target"]

def do_build(file):
    # Resolve dependencies
    dependencies = list(map(lambda f: f"build/{f}" if (f in config) else f"src/{f}", config[file]["dependencies"]))
    if "generate" in config[file]:
        content = eval_codegen(config[file]["generate"], dependencies)
        with open(f"build/{file}", "w+") as f:
            f.write(content)
    else:
        with open(join("src", file), "r") as src_file:
            with open(join("build", file), "w+") as out_file:
                for line in src_file:
                    start = line.find("CODEGEN_START")
                    if start != -1:
                        end = line.find("CODEGEN_END")
                        if end != -1:
                            code = line[start+len("CODEGEN_START"):end]
                            result = eval_codegen(code, dependencies)
                            new_line = line[:start] + result + line[end+len("CODEGEN_END"):]
                            out_file.write(new_line)
                            continue

                    out_file.write(line)



# Copy over files that don't need rebuild
for file in config:
    if not needs_rebuild(file):
        print(f"SKIP {file}")
        skip_count+=1
        new_build_map[file] = {}
        if "source_hash" in build_map[file]:
            new_build_map[file]["source_hash"] = build_map[file]["source_hash"]
        if "target" in config[file]:
            new_build_map[file]["target"] = config[file]["target"]

# Build rest
for file in config:
    build(file)
    
apply_count = 0
build_count = len(new_build_map)
# config
new_build_map["config.toml"] = {"source_hash": config_hash}

# Write map.toml
with open("build/map.toml", "w+") as new_map_file:
    toml.dump(new_build_map, new_map_file)

if len(sys.argv) > 1 and sys.argv[1] == "apply":
    for file in new_build_map:
        if "target" in new_build_map[file]:
            apply_count+=1
            target = new_build_map[file]["target"]
            shutil.copyfile(join("build", file), target)
            print(f"APPLY {file} => {target}")
else:
    print(f"Add \"apply\" in argument to apply the generated files to their targets")
print("")
print(f"{build_count} Processed, {skip_count} Skipped, {apply_count} Applied")