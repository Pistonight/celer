#!/usr/bin/python3
"""Print latest release notes from changelog"""

with open("CHANGELOG.md", "r", encoding="utf-8") as in_file:
    FOUND_LATEST = False
    for line in in_file:
        if FOUND_LATEST:
            if line.strip() == "# Older Versions":
                break
            print(line, end="")
            continue
        if line.strip().endswith("LATEST"):
            FOUND_LATEST = True
