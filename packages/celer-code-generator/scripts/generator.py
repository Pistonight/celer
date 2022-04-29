"""In-text code generator"""
from collections import deque
from os.path import join
import re
from .common import compact_name
from .csvutils import read_csv

VALID_CSV = [
    "korok_movements",
    "korok_regions",
    "korok_types",
    "koroks",
    "memories",
    "shrines",
    "towers"
]
# pylint: disable-next=too-many-branches
def read_format(format_string):
    """Return a function that can be used to format the format string passed in"""
    # Tokenize
    tokens = []
    while True:
        match = re.search("[\\{\\}]", format_string)
        if match is None:
            if len(format_string) > 0:
                tokens.append(format_string)
            break
        start = match.start()
        if start != 0:
            tokens.append(format_string[:start])
        tokens.append(format_string[start])
        format_string = format_string[start+1:]
    # Parse
    # Scan the tokens with a window of 5
    # If any matches { { string } }, it will be a variable
    parts = [] # (is_variable, string)
    current = ""
    i = 0
    while i < len(tokens):
        if i+4 < len(tokens):
            if tokens[i] == "{" and \
               tokens[i+1] == "{" and \
               tokens[i+3] == "}" and \
               tokens[i+4] == "}":
                if tokens[i+2] != "{" and tokens[i+2] != "}":
                    if current != "":
                        parts.append((False, current))
                        current = ""
                    parts.append((True, tokens[i+2]))
                    i = i+5
                    continue
        if i+8 < len(tokens):
            # pylint: disable-next=too-many-boolean-expressions
            if tokens[i] == "{" and \
               tokens[i+1] == "{" and \
               tokens[i+2] == "{" and \
               tokens[i+3] == "{" and \
               tokens[i+5] == "}" and \
               tokens[i+6] == "}" and \
               tokens[i+7] == "}" and \
               tokens[i+8] == "}":
                if tokens[i+4] != "{" and tokens[i+4] != "}":
                    if current != "":
                        parts.append((False, current))
                        current = ""
                    parts.append((False, f"{{{{{tokens[i+4]}}}}}"))
                    i = i+9
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
    """Code Generator"""
    def __init__(self, in_file, out_file):
        """Constructor"""
        self.in_file = in_file
        self.out_file = out_file
        self.line_queue = deque()
        self.functions = {}
        self.indent = -1

    def build(self):
        """Process the file and generate code"""
        self.indent = -1
        line_iter = iter(self.in_file)
        while True:
            try:
                line = self.get_next_line(line_iter)
                inline_include = line.strip().find("codegen include ")
                if inline_include != -1:
                    include_path = line.strip()[inline_include+16:]
                    self.read_include(include_path)
                elif line.strip().endswith("codegen define begin"):
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

    def get_next_line(self, line_iter):
        """Get next line, from stack or line_iter if stack is empty"""
        if len(self.line_queue) == 0:
            return next(line_iter)

        return self.line_queue.popleft()

    def read_include(self, path):
        """Read include line and inject file"""
        with open(join("src", path), "r", encoding="utf-8") as file:
            for line in file:
                self.line_queue.append(line)

    def read_define(self, line_iter):
        """Read define block and populate self.functions"""
        panic = False
        input_names = None
        func_name = None
        writes = []
        while not panic:
            try:
                line = self.get_next_line(line_iter)[self.indent:].strip()
                if line.startswith("func "):
                    func_name = line[5:]
                elif line.startswith("input "):
                    input_names = line[6:].split()
                elif line == "input":
                    input_names = []
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
            # preprcess args to escape \,
            args_array_escaped = []
            for arg in args_array:
                if len(args_array_escaped) > 0 and args_array_escaped[-1].endswith("\\"):
                    args_array_escaped[-1] = args_array_escaped[-1][:-1] + "," + arg
                else:
                    args_array_escaped.append(arg)

            args_map = {}
            for i, arg in enumerate(args_array_escaped):
                args_map[input_names[i]] = arg
            for write in writes:
                self.out_file.write(write(args_map)+"\n")
        self.functions[func_name] = execute

    # pylint: disable-next=too-many-locals too-many-statements too-many-branches
    def read_gen_csv(self, line_iter):
        """Read gen csv block and output the generated code to self.out_file"""
        panic = False
        data_name = None
        mappers = []
        write = None
        join_string = None
        prev_line = None
        while True:
            try:
                line = self.get_next_line(line_iter)[self.indent:].strip()
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
        # pylint: disable-next=too-many-nested-blocks
        while True:
            try:
                if prev_line is None:
                    line = self.get_next_line(line_iter)[self.indent:].strip()
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
                            map_line = self.get_next_line(line_iter)[self.indent:].strip()
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
                    def mapfunc(key):
                        if key in map_entries:
                            return map_entries[key]
                        return key
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
                    line = self.get_next_line(line_iter)[self.indent:].strip()
                else:
                    line = prev_line
                    prev_line = None
                if line.startswith("write "):
                    write = read_format(line[6:])
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
            for key, val, func in mappers:
                if key in args_map:
                    args_map[val] = func(args_map[key])
            outputs.append(write(args_map))

        read_csv(data_name, process)
        self.out_file.write(join_string.join(outputs))

    def read_gen(self, line_iter):
        """Read gen block and output to self.out_file"""
        while True:
            try:
                line = self.get_next_line(line_iter)[self.indent:].strip()
                if line == "codegen end":
                    break
                space_index = line.find(" ")
                if space_index == -1:
                    func_name = line
                    inputs = []
                else:
                    func_name = line[:space_index]
                    inputs = line[space_index+1:].split(",")

                if func_name not in self.functions:
                    self.out_file.write("<codegen error: unknown function>\n")
                    continue
                self.functions[func_name](inputs)

            except StopIteration:
                break
