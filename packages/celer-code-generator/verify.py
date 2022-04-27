#!/usr/bin/python3
"""Compare built files and the target to see if they are the same"""
from os.path import isfile, join
import filecmp
import sys
import toml

# Load config
with open("config.toml", "r", encoding="utf-8") as config_file:
    # filename => {target?, dependencies?, generate?}
    config = toml.load(config_file)

OK = True

for file in config:
    if "target" in config[file]:
        build_path = join("build", file)
        if not isfile(build_path):
            OK = False
            print(f"[FAIL] {build_path} is not built")
            continue
        target_path = config[file]["target"]
        if not isfile(target_path):
            OK = False
            print(f"[FAIL] {target_path} is not applied")
            continue
        if not filecmp.cmp(build_path, target_path):
            OK = False
            print(f"[FAIL] {build_path} and {target_path} differs")
            continue
        print(f"[PASS] {build_path} and {target_path} are identical")

print("Check finished")
if OK:
    print("No problems found")
else:
    print("Verify failed. \
    Please run `just buildc` to make sure the source files are generated properly.")
    sys.exit(1)
