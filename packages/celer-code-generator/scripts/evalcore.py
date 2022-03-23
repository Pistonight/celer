from .memoize import memoized_thunk
from .shrines import get_shrine_data
from .towers import get_tower_data
from .memories import get_memory_data
from .korok import get_korok_region_data
from .common import compact_name
import yaml
import json

# Contains all the functions to be called in the template files

def eval_codegen(code, dependencies): # dependencies made available to eval
    return eval(code.strip())

def __shrine_compact_name_regex():
    names = map(compact_name, sorted(get_shrine_data().keys()))
    return "|".join(names)
shrine_compact_name_regex = memoized_thunk(__shrine_compact_name_regex)

def __tower_compact_name_regex():
    names = map(compact_name, sorted(get_tower_data().keys()))
    return "|".join(names)
tower_compact_name_regex = memoized_thunk(__tower_compact_name_regex)

def __memory_compact_name_regex():
    names = map(compact_name, sorted(get_memory_data().keys()))
    return "|".join(names)
memory_compact_name_regex = memoized_thunk(__memory_compact_name_regex)

def yaml_to_json(file_name):
    with open(file_name, "r") as yaml_file:
        object = yaml.load(yaml_file, Loader=yaml.FullLoader)
        return json.dumps(object, indent=4)

def test_case(string):
    return f"""# {string}
{string}
\"{string}\"
\'{string}\'
- {string}
# {string}:
{string}:
\"{string}\":
\'{string}\':
- {string}:
# foo: {string}
foo: {string}
foo: \"{string}\"
foo: '{string}\'
- foo: {string}
test: " foo
{string}
bar "
test: ' foo
{string}
bar '
test: foo
  {string}
  bar
test: >
  foo
  {string}
  bar
test: |
  foo
  {string}
  bar

"""

def populate_korok_regions(korok_regions):
    result = ["Generated Code"]
    data = get_korok_region_data()
    for region in data:
        count, name = data[region]
        result.append(f"{korok_regions}[\"{region}\"] = {{name: \"{name}\", count: {count}}};")
    return "\n".join(result)

def register_shrine_presets():
    result = ["Generated Code"]
    data = get_shrine_data()
    for name in data:
        type = data[name][0]
        prefix = ""
        if type == "TosMinor":
            prefix = "(minor ToS) "
        elif type == "TosSkip":
            prefix = "(modest/major ToS) "
        elif type == "Blessing":
            prefix = "(blessing) "
        elif type == "DLC":
            prefix = "(DLC) "
        result.append(f"        register(\"{compact_name(name)}\", \"{prefix}{name} Shrine\");")
    return "\n".join(result)

def register_tower_presets():
    result = ["Generated Code"]
    data = get_tower_data()
    for name in data:
        result.append(f"        register(\"{compact_name(name)}\", \"{name} Tower\");")
    return "\n".join(result)

def register_memory_presets():
    result = ["Generated Code"]
    data = get_memory_data()
    for name in data:
        result.append(f"        register(\"{compact_name(name)}\", \"{data[name][0]}\");")
    return "\n".join(result)
