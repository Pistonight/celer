"""Validation Imports for celer-devtool and celer-lib"""
# imports must be sorted and std imports must preceed others

from os.path import isdir, isfile, join
from os import listdir
import sys
from enum import Enum

class CodeGroup(Enum):
    """Enum for type of statement"""
    PUB_IMPORT = 0
    PRIV_MOD = 1
    PRIV_IMPORT = 2
    PUB_MOD = 3
    RE_EXPORT = 4
    CODE = 5
    TEST = 6

class PubImportType(Enum):
    """Enum for type of public import (use statement)"""
    STD = 7
    EXTERNAL = 8
    CELER = 9
    CRATE = 10
    SUPER = 11

# pylint: disable-next=too-many-return-statements
def get_code_group(line, private_mods):
    """Get the type of statement"""
    if line.startswith("use "):
        crate = get_crate_from_line(line)
        if crate is None:
            return CodeGroup.CODE
        if crate in private_mods:
            return CodeGroup.PRIV_IMPORT
        return CodeGroup.PUB_IMPORT
    if line.startswith("mod "):
        return CodeGroup.PRIV_MOD
    if line.startswith("pub mod "):
        return CodeGroup.PUB_MOD
    if line.startswith("pub use "):
        return CodeGroup.RE_EXPORT
    if line.startswith("#[cfg(test)]"):
        return CodeGroup.TEST
    return CodeGroup.CODE

def get_pub_import_type(crate):
    """Get type of public import"""
    if crate == "std":
        return PubImportType.STD
    if crate == "celer":
        return PubImportType.CELER
    if crate == "crate":
        return PubImportType.CRATE
    if crate == "super":
        return PubImportType.SUPER
    return PubImportType.EXTERNAL


def get_crate_offset_and_end(line):
    """Get (crate_start_index, end_delimiter)"""
    if line.startswith("use "):
        return 4, "::"
    if line.startswith("pub use "):
        return 8, "::"
    if line.startswith("mod "):
        return 4, ";"
    if line.startswith("pub mod"):
        return 8, ";"
    return 0, None
def get_crate_from_line(line):
    """Get crate name from line"""
    begin_index, end = get_crate_offset_and_end(line)
    if end is None:
        return None
    end_index = line.find(end)
    if end_index < 0:
        return None
    return line[begin_index:end_index]

def get_mod_from_line(line):
    """Remove statement prefix to get full module name string"""
    begin_index, _ = get_crate_offset_and_end(line)
    return line[begin_index:-1]

def append_error(error_lines, i, line, error):
    """Add error"""
    line_num_string = f"{i+1}"
    line_num_width = len(line_num_string)
    error_lines.append(f"  {line_num_string}: {line[:-1]}")
    offset, _ = get_crate_offset_and_end(line)
    spacer = " "*(4+line_num_width+offset)
    error_lines.append(f"{spacer}^ {error}")

# pylint: disable-next=too-many-branches, too-many-statements
def validate_file(file_name):
    """Validate a file, return array of errors"""
    errors = []
    current_group = CodeGroup.PUB_IMPORT
    current_pub_import = PubImportType.STD
    external_crates = []
    private_crates = []

    last_accepted = None
    with open(file_name, "r", encoding="utf-8") as file:
        for i, line in enumerate(file):
            if len(line.rstrip()) == 0 or line.startswith("/* Import Validation Exempt */"):
                continue
            group = get_code_group(line, private_crates)
            if group == CodeGroup.TEST:
                # ignore test code
                break
            if group.value < current_group.value:
                append_error(errors, i, line,
                    f"Code group {group.name} must preceed the {current_group.name} group")
                continue
            if group == CodeGroup.CODE:
                current_group = group
                continue
            crate = get_crate_from_line(line)
            if crate is None:
                append_error(errors, i, line, "Cannot determine crate name")
                continue

            # validate external vs private imports
            if group == CodeGroup.PRIV_MOD:
                if crate in external_crates:
                    append_error(errors, i, line,
                        f"private mod {crate} should be declared before import")
                    continue
                private_crates.append(crate)

            # for pub imports we want to check sorting only within same type
            if group == CodeGroup.PUB_IMPORT:
                pub_import = get_pub_import_type(crate)
                if pub_import == PubImportType.EXTERNAL and crate not in external_crates:
                    external_crates.append(crate)
                if pub_import.value < current_pub_import.value:
                    append_error(errors, i, line,
f"Pub import type {pub_import.name} must preceed the {current_pub_import.name} type")
                    continue
                if pub_import == current_pub_import:
                    # Check alphabetical sorting
                    mod_name = get_mod_from_line(line)
                    if last_accepted is not None and mod_name < last_accepted:
                        append_error(errors, i, line,
f"Pub import must be sorted alphabetically within types. \
{mod_name} should be before {last_accepted}")
                        continue
                    last_accepted = mod_name
                else:
                    last_accepted = None
                    current_pub_import = pub_import

            elif group == current_group:
                 # Check alphabetical sorting
                mod_name = get_mod_from_line(line)
                if last_accepted is not None and mod_name < last_accepted:
                    append_error(errors, i, line,
f"Statements must be sorted alphabetically within groups. \
{mod_name} should be before {last_accepted}")
                    continue
                last_accepted = mod_name

            else: # group > current_group
                last_accepted = None
                current_group = group

    return errors

def validate_path(path, error_map):
    """Validate directory or file"""
    if isdir(path):
        for subpath in listdir(path):
            validate_path(join(path, subpath), error_map)
    elif isfile(path):
        if path.endswith(".rs"):
            error_lines = validate_file(path)
            if len(error_lines) > 0:
                error_map[path] = error_lines

def run(arg):
    """Entry point"""
    error_map = {}
    validate_path(arg, error_map)
    if len(error_map) > 0:
        error_count = 0
        for file, errors in error_map.items():
            print(f"Error in {file}:")
            for error in errors:
                print(error)
                error_count+=1
            print("")
        print(f"{error_count} error(s) found in {len(error_map)} file(s)")
        return 1
    return 0

ERROR = 0
for p in sys.argv[1:]:
    ERROR += run(p)
sys.exit(ERROR)
