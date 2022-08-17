#!/usr/bin/python3
"""Check the versions"""

import sys

OK = True
def get_version(verion_map, file, line_number, position, end):
    """Get version string and populate in map"""
    with open(file, "r", encoding="utf-8") as in_file:
        for i, line in enumerate(in_file):
            if i == line_number-1:
                if len(end) == 0:
                    end_index = -1
                else:
                    end_index = line.find(end, position)
                verion_map[file] = line[position:end_index]
                return

def check_package_versions(package, versions):
    """Check the versions and report if mismatch"""
    # pylint: disable-next=global-statement
    global OK
    if not versions_match(versions):
        report_mismatch(package, versions)
        OK = False

def versions_match(versions):
    """Check if the versions are the same"""
    base = None
    for name in versions:
        if base is None:
            base = versions[name]
        elif base != versions[name]:
            return False
    return True

def report_mismatch(package, versions):
    """Print the mismatched versions"""
    print(f"Version mismatch found in {package}")
    for name in versions:
        print(f"{versions[name]} in {name}")
    print("")

def check_package(package, root_path, configs):
    """API to check versions"""
    versions = {}
    for config in configs:
        path, line, col, end = config
        get_version(versions, root_path + path, line, col, end)
    check_package_versions(package, versions)

check_package("celer-web-app", "packages/celer-web-app/", [
    ("package.json", 4, 14, "\""),
    ("CHANGELOG.md", 4, 4, "`"),
    ("src/data/util/version.ts", 1, 30, "\"")
])

check_package("celer-vscode-extension", "packages/celer-vscode-extension/", [
    ("package.json", 5, 16, "\""),
    ("README.md", 19, 4, "`"),
    ("CHANGELOG.md", 4, 4, "`")
])

check_package("celer-devtool", "packages/celer-devtool/", [
    ("CHANGELOG.md", 4, 4, "`"),
    ("Cargo.toml", 3, 11, "\""),
    ("src/main.rs", 6, 27, "\""),
    ("../celer-e2e-test/tests/version/version.txt", 1, 14, ""),
    ("../celer-e2e-test/tests/version/long_version.txt", 1, 14, " ")
])

check_package("celer-lib", "packages/celer-lib/", [
    ("CHANGELOG.md", 4, 4, "`"),
    ("Cargo.toml", 3, 11, "\""),
    ("src/lib.rs", 8, 27, "\""),
    ("../celer-e2e-test/tests/version/long_version.txt", 1, 25, ")")
])

if not OK:
    sys.exit(-1)
