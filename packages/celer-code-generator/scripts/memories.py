"""Memory data"""
from .csvutils import read_csv
from .memoize import memoized_thunk
# display_name => (title, x, y, z)
def __get_memory_data():
    memories = {}
    read_csv("memories", lambda line: __add_memory(memories, line))
    return memories

def __add_memory(memories,line):
    memories[line[0]] = (line[1], float(line[2]), float(line[3]), float(line[4]))

get_memory_data = memoized_thunk(__get_memory_data)
