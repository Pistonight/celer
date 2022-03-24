"""Tower data"""
from .csvutils import read_csv
from .memoize import memoized_thunk
# display_name => (x, y, z)
def __get_tower_data():
    towers = {}
    read_csv("towers", lambda line: __add_tower(towers, line))
    return towers

def __add_tower(towers,line):
    towers[line[0]] = (float(line[1]), float(line[2]), float(line[3]))

get_tower_data = memoized_thunk(__get_tower_data)
