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

def checkPackage(package, versions):
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

# celer-user-docs
CELER_USER_DOCS_VERSIONS = {}
getVersion(CELER_USER_DOCS_VERSIONS, "packages/celer-user-docs/CHANGELOG.md", 7, 4, "`")
getVersion(CELER_USER_DOCS_VERSIONS, "packages/celer-user-docs/README.md", 2, 10, "`")
checkPackage("celer-user-docs", CELER_USER_DOCS_VERSIONS)
    
# celer-web-app
CELER_WEB_APP_VERSIONS = {}
getVersion(CELER_WEB_APP_VERSIONS, "packages/celer-web-app/package.json", 4, 14, "\"")
getVersion(CELER_WEB_APP_VERSIONS, "packages/celer-web-app/CHANGELOG.md", 12, 4, "`")
getVersion(CELER_WEB_APP_VERSIONS, "packages/celer-web-app/src/data/util/version.ts", 1, 30, "\"")
checkPackage("celer-web-app", CELER_WEB_APP_VERSIONS)

# celer-vscode-extension
CELER_VSCODE_EXTENSION_VERSIONS = {}
getVersion(CELER_VSCODE_EXTENSION_VERSIONS, "packages/celer-vscode-extension/package.json", 5, 16, "\"")
getVersion(CELER_VSCODE_EXTENSION_VERSIONS, "packages/celer-vscode-extension/README.md", 19, 4, "")
getVersion(CELER_VSCODE_EXTENSION_VERSIONS, "packages/celer-vscode-extension/CHANGELOG.md", 7, 4, "`")
checkPackage("celer-vscode-extension", CELER_VSCODE_EXTENSION_VERSIONS)

if not OK:
    sys.exit(-1)
