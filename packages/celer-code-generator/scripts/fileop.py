"""File operations"""
import json
import yaml

def fileop(function, file_name):
    """Wrapper function"""
    if function == "yaml_to_json":
        return yaml_to_json(file_name)
    return "Invalid fileop function"

def yaml_to_json(file_name):
    """Convert yaml file to json"""
    with open(file_name, "r", encoding="utf-8") as yaml_file:
        obj = yaml.load(yaml_file, Loader=yaml.FullLoader)
        return json.dumps(obj, indent=4) + "\n"
