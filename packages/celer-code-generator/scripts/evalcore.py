"""Core eval functions"""
import json
import yaml
from .memoize import memoized_thunk
from .shrines import get_shrine_data
from .towers import get_tower_data
from .memories import get_memory_data
from .korok import get_korok_region_data
from .common import compact_name

# Contains all the functions to be called in the template files

# dependencies made available to eval
# pylint: disable-next=unused-argument
def eval_codegen(code, dependencies):
    """Eval code to generate code"""
    # pylint: disable-next=eval-used
    return eval(code.strip())

def __shrine_compact_name_regex():
    """Get a regex to recognize compact shrine names"""
    names = map(compact_name, sorted(get_shrine_data().keys()))
    return "|".join(names)
shrine_compact_name_regex = memoized_thunk(__shrine_compact_name_regex)

def __tower_compact_name_regex():
    """Get a regex to recognize compact tower names"""
    names = map(compact_name, sorted(get_tower_data().keys()))
    return "|".join(names)
tower_compact_name_regex = memoized_thunk(__tower_compact_name_regex)

def __memory_compact_name_regex():
    """Get a regex to recognize compact memory names"""
    names = map(compact_name, sorted(get_memory_data().keys()))
    return "|".join(names)
memory_compact_name_regex = memoized_thunk(__memory_compact_name_regex)

def yaml_to_json(file_name):
    """Convert yaml file to json"""
    with open(file_name, "r", encoding="utf-8") as yaml_file:
        obj = yaml.load(yaml_file, Loader=yaml.FullLoader)
        return json.dumps(obj, indent=4) + "\n"

def test_case(string):
    """Generate a celer syntax test case"""
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
    """Generate TS korok region"""
    result = ["Generated Code"]
    data = get_korok_region_data()
    for region in data:
        count, name = data[region]
        result.append(f"{korok_regions}.{region} = {{name: \"{name}\", count: {count}}};")
    return "\n".join(result)

def register_shrine_presets():
    """Generate TS shrine presets"""
    result = ["Generated Code"]
    data = get_shrine_data()
    for name in data:
        shrine_type = data[name][0]
        prefix = ""
        if shrine_type == "TosMinor":
            prefix = "(minor ToS) "
        elif shrine_type == "TosSkip":
            prefix = "(modest/major ToS) "
        elif shrine_type == "Blessing":
            prefix = "(blessing) "
        elif shrine_type == "DLC":
            prefix = "(DLC) "
        result.append(f"\t\tregister(\"{compact_name(name)}\", \"{prefix}{name} Shrine\");")
    return "\n".join(result)

def register_tower_presets():
    """Genreate TS tower presets"""
    result = ["Generated Code"]
    data = get_tower_data()
    for name in data:
        result.append(f"\t\tregister(\"{compact_name(name)}\", \"{name} Tower\");")
    return "\n".join(result)

def register_memory_presets():
    """Generate TS memory presets"""
    result = ["Generated Code"]
    data = get_memory_data()
    for name in data:
        result.append(f"\t\tregister(\"{compact_name(name)}\", \"{data[name][0]}\");")
    return "\n".join(result)
