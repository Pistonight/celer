#!/usr/bin/python3
"""Print latest release notes from changelog"""

PACKAGES = []

with open("CHANGELOG.md", "r", encoding="utf-8") as in_file:
    FOUND_LATEST = False
    for line in in_file:
        if FOUND_LATEST:
            if line.strip().startswith("#") or line.strip() == "":
                break
            PACKAGES.append(line.strip())
            continue
        if line.strip().endswith("`LATEST`"):
            FOUND_LATEST = True

for package in PACKAGES:
    CHANGELOG = f"packages/{package}/CHANGELOG.md"

    with open(CHANGELOG, "r", encoding="utf-8") as in_file:
        FOUND_LATEST = False
        for line in in_file:
            if FOUND_LATEST:
                if line.strip().startswith("#"):
                    break
                print(line, end="")
                continue
            if line.strip().endswith("`LATEST`"):
                ## `1.0.1` - `03-28-2022` `LATEST` ->
                ## `package-name`  `1.0.1` - `03-28-2022`
                CLOSE = line.find("`", 4)+1
                print(f"## `{package}` {line[3:CLOSE]}")

                FOUND_LATEST = True
