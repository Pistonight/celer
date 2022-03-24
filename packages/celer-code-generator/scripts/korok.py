"""Korok data"""
from .csvutils import read_csv
from .memoize import memoized_thunk

# region => (count, name)
def __get_korok_region_data():
    regions = {}
    read_csv("korok_regions", lambda line: __add_region(regions, line))
    return regions

def __add_region(regions,line):
    regions[line[0]] = (int(line[1]), line[2])

get_korok_region_data = memoized_thunk(__get_korok_region_data)
