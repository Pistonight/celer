"""Validation Imports"""
# There are 3 types of allowed imports
# External dependencies: react, query-string, etc
# Internal packages: app/services, ui/root, etc
# Relative directories: starting with .

# The imports should be grouped in the order of External -> Internal -> Relative
# Within each group, the imports should be alphabetically sorted

# Can exempt an import statement by prefixing with /*import-validation-exempt*/
from os.path import isdir, isfile, join
from os import listdir
import sys

def get_dependency_from_line(line):
    """Get dependency name from import statements"""
    if not line.startswith("import"):
        return None
    start = line.find("\"")
    if start > 0:
        return line[start+1:-3] # remove ";\n
    return None

def get_export_from_line(line):
    """Get export name from import statements"""
    if not line.startswith("export * from"):
        return None
    start = line.find("\"")
    if start > 0:
        return line[start+1:-3] # remove ";\n
    return None

MAX_SLASH = 1
RELATIVE = "RELATIVE"
EXTERNAL = "EXTERNAL"
BANNED = [".", ".."]
# Modules in later package cannot depend on earlier packages.
# The imports need to be in this order too
INTERNAL_ALLOWED_ORDER = ["app", "ui", "core", "data"]
ALL_ALLOWED_ORDER = [EXTERNAL, "app", "ui", "core", "data", RELATIVE]
def get_dependency_type(dependency):
    """Get dependency type from dependency name"""
    if dependency.startswith("."):
        return RELATIVE
    for internal in INTERNAL_ALLOWED_ORDER:
        if dependency.startswith(internal+"/"):
            return internal
    return EXTERNAL

# pylint: disable-next=too-many-branches
def validate_file(file_name, package):
    """Validate a file, return array of errors"""
    errors = []
    if package is None:
        all_allowed = ALL_ALLOWED_ORDER[:]
    else:
        all_allowed = [EXTERNAL] + \
            INTERNAL_ALLOWED_ORDER[INTERNAL_ALLOWED_ORDER.index(package):] + [RELATIVE]
    allowed = all_allowed[:]

    last_accepted = None
    multi_line = False
    with open(file_name, "r", encoding="utf-8") as file:
        for line in file:
            if multi_line:
                if line.startswith("} from"):
                    line = "import "+line
                    multi_line = False
                else:
                    continue
            else:
                if line.startswith("import ") and not line.strip().endswith(";"):
                    multi_line = True
                    continue
            if line.startswith("/*import-validation-exempt*/"):
                continue

            dependency = get_dependency_from_line(line)
            if dependency is None:
                continue
            if dependency in BANNED:
                errors.append(f"{line}\
      - {dependency} is banned")
                continue
            if dependency.startswith("..") and dependency.count("/") > MAX_SLASH:
                errors.append(f"{line}\
      - {dependency} has too many slashes. Max: {MAX_SLASH}")
                continue

            dep_type = get_dependency_type(dependency)
            if dep_type not in all_allowed:
                errors.append(f"{line}\
      - {dependency} is not allowed here because this module is inside {package} package")
                continue

            if dep_type not in allowed:
                errors.append(f"{line}\
      - {dependency} ({dep_type}) is not allowed here. Allowed types: {allowed}")
                continue
            if dep_type not in (EXTERNAL, RELATIVE):
                if dependency.count("/") > MAX_SLASH:
                    errors.append(f"{line}\
      - {dependency} has too many slashes. Max: {MAX_SLASH}")
                    continue

            if last_accepted is not None and len(allowed) > 0 and dep_type == allowed[0]:
                # Check alphabetical order
                if last_accepted > dependency:
                    errors.append(f"{line}\
      - Imports of the same type needs to be alphabetically sorted. \
{dependency} should be before {last_accepted}")
                elif last_accepted == dependency:
                    errors.append(f"{line}\
      - Duplicate imports not allowed")
            allowed = allowed[allowed.index(dep_type):]
            last_accepted = dependency
    if multi_line:
        errors.append(f"{file_name} has imports that are not formatted correctly")
    return errors

def add_error(errors, line, dependency, dep_type, allowed):
    """Format error string and add to errors array"""
    errors.append(f"{line}\
      - {dependency} ({dep_type}) is not allowed here. Allowed types: {allowed}")

def validate_path(path, package, error_map):
    """Validate directory or file"""
    if isdir(path):
        for subpath in listdir(path):
            if package is None:
                if subpath in ("app", "ui", "core", "data"):
                    next_package = subpath
                else:
                    next_package = None
            else:
                next_package = package
            validate_path(join(path, subpath), next_package, error_map)
    elif isfile(path):
        if path.endswith(".ts") or path.endswith(".tsx"):
            errors = validate_file(path, package)
            if path.endswith("index.ts") or path.endswith("index.tsx"):
                errors = errors + validate_export_index(path)
            if len(errors) > 0:
                error_map[path] = errors

def validate_export_index(file_name):
    """Validate index file"""
    errors = []
    last_accepted = ""
    with open(file_name, "r", encoding="utf-8") as file:
        for line in file:
            export_from = get_export_from_line(line)
            if export_from is None:
                continue

            if not export_from.startswith("./"):
                errors.append(f"{line}\
      - Index export path must start with ./")
                continue
            if last_accepted > export_from:
                errors.append(f"{line}\
      - Index export path must be sorted. {export_from} should be before {last_accepted}")
            elif last_accepted == export_from:
                errors.append(f"{line}\
      - Duplicate export not allowed")
        last_accepted = export_from
    return errors

def run(arg):
    """Entry point"""
    error_map = {}
    validate_path(arg, None, error_map)
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

sys.exit(run(sys.argv[1]))
