"""Validation Imports for celer-cli and celer-lib"""
# imports must be sorted and std imports must preceed others

from os.path import isdir, isfile, join
from os import listdir
import sys

def get_crate_from_line(line):
    """Get crate name from use statements"""
    if not line.startswith("use "):
        return None
    if line.startswith("use crate"): # will handle this better later
        return None
    return line[4:-1] # remove \n

def is_std(crate):
    """Test if an import is from std"""
    return crate.startswith("std::")

def validate_file(file_name):
    """Validate a file, return array of errors"""
    errors = []
    has_non_std = False

    last_accepted = None
    with open(file_name, "r", encoding="utf-8") as file:
        for line in file:

            crate = get_crate_from_line(line)
            if crate is None:
                continue

            std = is_std(crate)
            if has_non_std and std:
                errors.append(f"{line}\
      - {crate} must preceed non std imports")
                continue

            if not std and not has_non_std:
                # Reset sort order check when going to non std
                last_accepted = None
                has_non_std = True
                continue

            if last_accepted is not None:
                # Check alphabetical order
                if last_accepted > crate:
                    errors.append(f"{line}\
      - Imports of the group (std or non-std) needs to be alphabetically sorted. \
{crate} should be before {last_accepted}")

            last_accepted = crate

    return errors

def validate_path(path, error_map):
    """Validate directory or file"""
    if isdir(path):
        for subpath in listdir(path):
            validate_path(join(path, subpath), error_map)
    elif isfile(path):
        if path.endswith(".rs"):
            errors = validate_file(path)
            if len(errors) > 0:
                error_map[path] = errors

def run(arg):
    """Entry point"""
    error_map = {}
    validate_path(arg, error_map)
    if len(error_map) > 0:
        error_count = 0
        for file, errors in error_map.items():
            print(f"Error in {file}:")
            for error in errors:
                print(f"    {error}")
                error_count+=1
            print("")
        print(f"{error_count} error(s) found in {len(error_map)} file(s)")
        return 1
    return 0

ERROR = 0
for p in sys.argv[1:]:
    ERROR += run(p)
sys.exit(ERROR)
