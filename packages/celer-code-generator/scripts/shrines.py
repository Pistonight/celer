"""Shrine data"""
from .csvutils import read_csv
from .memoize import memoized_thunk
# Get shrine data, which is a dictionary of:
# display_name => (type, x, y, z)
def __get_shrine_data():
    shrines = {}
    read_csv("shrines", lambda line: __add_shrine(shrines, line))
    return shrines

def __add_shrine(shrines,line):
    shrines[line[0]] = (line[1], float(line[2]), float(line[3]), float(line[4]))

get_shrine_data = memoized_thunk(__get_shrine_data)
