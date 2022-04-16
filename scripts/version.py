#!/usr/bin/python3
"""Check the versions"""

import sys


OK = True
def getVersion(map, file, line_number, position, end):
    """Get version string and populate in map"""
    with open(file, "r", encoding="utf-8") as in_file:
        for i, line in enumerate(in_file):
            if i == line_number-1:
                if len(end) == 0:
                    end_index = -1
                else:
                    end_index = line.find(end, position)
                map[file] = line[position:end_index]
                return

def checkPackageVersions(package, versions):
    global OK
    if not versionsMatch(versions):
        reportMismatch(package, versions)
        OK = False

def versionsMatch(versions):
    base = None
    for name in versions:
        if base is None:
            base = versions[name]
        elif base != versions[name]:
            return False
    return True

def reportMismatch(package, versions):
    print(f"Version mismatch found in {package}")
    for name in versions:
        print(f"{versions[name]} in {name}")
    print("")

def checkPackage(package, root_path, configs):
    versions = {}
    for config in configs:
        path, line, col, end = config
        getVersion(versions, root_path + path, line, col, end)
    checkPackageVersions(package, versions)

checkPackage("celer-user-docs", "packages/celer-user-docs/", [
    ("CHANGELOG.md", 4, 4, "`"),
    ("README.md", 2, 10, "`")
])

checkPackage("celer-web-app", "packages/celer-web-app/", [
    ("package.json", 4, 14, "\""),
    ("CHANGELOG.md", 4, 4, "`"),
    ("src/data/util/version.ts", 1, 30, "\"")
])

checkPackage("celer-vscode-extension", "packages/celer-vscode-extension/", [
    ("package.json", 5, 16, "\""),
    ("README.md", 19, 4, "`"),
    ("CHANGELOG.md", 4, 4, "`")
])

checkPackage("celer-cli", "packages/celer-cli/", [
    ("CHANGELOG.md", 4, 4, "`"),
    ("Cargo.toml", 3, 11, "\""),
    ("src/main.rs", 1, 27, "\"")
])

if not OK:
    sys.exit(-1)
