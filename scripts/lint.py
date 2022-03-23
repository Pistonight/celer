#!/usr/bin/python3
# Check LF line ending and empty new line in the end

from os import listdir
from os.path import isfile, isdir, join
import sys

ignore = [
    "build",
    "node_modules",
    ".git",
    "__pycache__",
    ".vscode"
]

if len(sys.argv) > 1:
    ROOT = sys.argv[1]
else:
    ROOT = "."

def lint_path(path):
    if isfile(path):
        lint_file(path)
    elif isdir(path):
        for subpath in listdir(path):
            if subpath not in ignore:
                lint_path(join(path, subpath))

bad_files = []

def lint_file(path):
    with open(path, 'r', newline="") as file:
        last_line = None
        prev_line = None
        while True:
            line = file.readline()
            if not line:
                break
            if line.find("\r") != -1:
                bad_files.append(("Line Ending", path))
                return
            prev_line = last_line
            last_line = line
        if last_line != None:
            if last_line != "\n":
                bad_files.append(("Need trailing new line", path))
            elif last_line == prev_line:
                bad_files.append(("Too many trailing new lines", path))

lint_path(ROOT)

if len(bad_files) > 0:
    for reason, path in bad_files:
        print(f"{path}: {reason}")
    sys.exit(1)
