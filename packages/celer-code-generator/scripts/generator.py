from .common import compact_name 
from .csvutils import read_csv
import re
VALID_CSV = [
    "korok_movements",
    "korok_regions",
    "korok_types",
    "koroks",
    "memories",
    "shrines",
    "towers"
]
def read_format(format):
    """Return a function that can be used to format the format string passed in"""
    # Tokenize
    tokens = []
    while True:
        match = re.search("[\\{\\}]", format)
        if match is None:
            if len(format) > 0:
                tokens.append(format)
            break
        start = match.start()
        if start != 0:
            tokens.append(format[:start])
        tokens.append(format[start])
        format = format[start+1:]
    # Parse
    # Scan the tokens with a window of 5
    # If any matches { { string } }, it will be a variable
    parts = [] # (is_variable, string)
    current = ""
    i = 0
    while i < len(tokens):
        if i+4 < len(tokens):
            if tokens[i] == "{" and tokens[i+1] == "{" and tokens[i+3] == "}" and tokens[i+4] == "}":
                if tokens[i+2] != "{" and tokens[i+2] != "}":
                    if current != "":
                        parts.append((False, current))
                        current = ""
                    parts.append((True, tokens[i+2]))
                    i = i+5
                    continue
        current+=tokens[i]
        i+=1
    if current != "":
        parts.append((False, current))

    def formatter(arg_map):
        output = ""
        for is_variable,string in parts:
            if is_variable:
                if string in arg_map:
                    output+=arg_map[string]
            else:
                output+=string
        return output
    return formatter

class CodeGenerator:
    def __init__(self, in_file, out_file):
        self.in_file = in_file
        self.out_file = out_file
        self.functions = {}
    
    def build(self):
        self.indent = -1
        line_iter = iter(self.in_file)
        while True:
            try:
                line = next(line_iter)
                if line.strip().endswith("codegen define begin"):
                    self.indent = line.find("codegen")
                    self.read_define(line_iter)
                elif line.strip().endswith("codegen csv begin"):
                    self.indent = line.find("codegen")
                    self.read_gen_csv(line_iter)
                elif line.strip().endswith("codegen begin"):
                    self.indent = line.find("codegen")
                    self.read_gen(line_iter)
                else:
                    self.out_file.write(line)
            except StopIteration:
                break
           

    def read_define(self, line_iter):
        panic = False
        input_names = None
        func_name = None
        writes = []
        while not panic:
            try:
                line = next(line_iter)[self.indent:].strip()
                if line.startswith("func "):
                    func_name = line[5:]
                elif line.startswith("input "):
                    input_names = line[6:].split()
                elif line.startswith("write "):
                    writes.append(read_format(line[6:]))
                elif line == "codegen define end":
                    break
                else:
                    panic = True
            except StopIteration:
                panic = True
        if input_names is None or func_name is None:
            panic = True
        if panic:
            self.out_file.write("<codegen error: define error>\n")
            return
        def execute(args_array):
            # Bind args
            args_map = {}
            for i, arg in enumerate(args_array):
                args_map[input_names[i]] = arg
            for write in writes:
                self.out_file.write(write(args_map)+"\n")
        self.functions[func_name] = execute

    def read_gen_csv(self, line_iter):
        panic = False
        data_name = None
        mappers = []
        write = None
        join_string = None
        prev_line = None
        while True:
            try:
                line = next(line_iter)[self.indent:].strip()
                if line.startswith("from "):
                    data_name = line[5:]
                else:
                    prev_line = line
                    break
            except StopIteration:
                break
        if data_name is None or data_name not in VALID_CSV:
            self.out_file.write("<codegen error: missing or invalid csv data>\n")
            return
        while True:
            try:
                if prev_line is None:
                    line = next(line_iter)[self.indent:].strip()
                else:
                    line = prev_line
                    prev_line = None
                if line.startswith("map prop "):
                    mapping = line[9:].split("=>")
                    map_key = mapping[0].strip()
                    map_value = mapping[1].strip()
                    map_entries = {}
                    while True:
                        try:
                            map_line = next(line_iter)[self.indent:].strip()
                            if map_line.startswith("map entry "):
                                map_entry_string = map_line[10:].split("=>")
                                map_entry_key = map_entry_string[0].strip()[1:-1]
                                map_entry_value = map_entry_string[1].strip()[1:-1]
                                map_entries[map_entry_key] = map_entry_value
                            else:
                                prev_line = map_line
                                break
                        except StopIteration:
                            break
                    def mapfunc(input):
                        if input in map_entries:
                            return map_entries[input]
                        return input
                    mappers.append((map_key, map_value, mapfunc))
                elif line.startswith("compact "):
                    compact_string = line[8:].split("=>")
                    compact_key = compact_string[0].strip()
                    compact_value = compact_string[1].strip()
                    mappers.append((compact_key, compact_value, compact_name))
                else:
                    prev_line = line
                    break
            except StopIteration:
                break
        while not panic:
            try:
                if prev_line is None:
                    line = next(line_iter)[self.indent:].strip()
                else:
                    line = prev_line
                    prev_line = None
                if line.startswith("write "):
                    format = line[6:]
                    write = read_format(format)
                elif line.startswith("joined with newline"):
                    join_string = "\n"
                elif line.startswith("joined with "):
                    join_string = line[12:]
                elif line == "codegen csv end":
                    break
                else:
                    panic = True
            except StopIteration:
                panic = True
        if panic:
            self.out_file.write("<codegen error: unterminated>\n")
            return
        if write is None or join_string is None:
            self.out_file.write("<codegen error: missing join or write>\n")
            return

        # Start processing
        outputs = []
        def process(args_map):
            for k, v, f in mappers:
                if k in args_map:
                    args_map[v] = f(args_map[k])
            outputs.append(write(args_map))

        read_csv(data_name, process)
        self.out_file.write(join_string.join(outputs))

    def read_gen(self, line_iter):
        while True:
            try:
                line = next(line_iter)[self.indent:].strip()
                if line == "codegen end":
                    break
                space_index = line.find(" ")
                if space_index == -1:
                    self.out_file.write("<codegen error: no function>\n")
                    continue
                func_name = line[:space_index]
                if func_name not in self.functions:
                    self.out_file.write("<codegen error: unknown function>\n")
                    continue
                inputs = line[space_index+1:].split(",")
                self.functions[func_name](inputs)

            except StopIteration:
                break