from dataclasses import dataclass
import sys
import os
import urllib.parse

from stat import S_IREAD, S_IRGRP, S_IROTH, S_IWRITE, S_IWGRP, S_IWOTH

LOCAL_IMAGE_ROOT = "../"
LOCAL_LINK_ROOT = "./"
PROD_IMAGE_ROOT = "https://raw.githubusercontent.com/iTNTPiston/celer/main/packages/celer-wiki/"
PROD_LINK_ROOT = "https://github.com/iTNTPiston/celer/wiki/"
LOCAL_BUILD_DIR = "build/"
PROD_BUILD_DIR = "release/"

def process_page_text(text, dir_path, is_release, abs_path_map):
    out_parts = []
    state = 0
    # state machine
    # states: 
    # 0: ..
    # 1: [.. or ![..
    # 2: [...](.. or ![...](..

    # [ => 
    # all states: flush, change to state 1, clear  name buffer
    # ![ => 
    # all states: flush, change to state 1, clear  name buffer
    # ]( =>
    # state 1: change to state 2, clear link buffer
    # other: change to state 0
    # ) => 
    # state 2: process(mode, name, link), flush
    # OTHER =>
    # state 0: nothing (inc index)
    # state 1: read into name buffer
    # state 2: read into link buffer
    unflushed_start = 0
    name_start = -1
    link_start = -1

    name = ""
    link = ""
    replace = ""

    is_link = False

    length = len(text)
    i = 0
    while i < length:
        char = text[i]
        next_char = text[i+1] if i < length - 1 else "\n"
        if char == "[" or (char == "!" and next_char == "["):
            out_parts.append(text[unflushed_start:i])
            unflushed_start = i
            state = 1
            is_link = char == "["
            name_start = i+1
            if next_char == "[":
                i += 1
                name_start += 1
        elif char == "]" and next_char == "(":
            if state == 1:
                state = 2
                name = text[name_start:i]
                link_start = i+2
            else:
                state = 0
        elif char == ")" and state == 2:
            link = text[link_start:i]
            replace = get_replacement(dir_path, is_link, name, link, is_release, abs_path_map)
            out_parts.append(replace)
            unflushed_start = i+1
            state = 0

        i+=1
    
    out_parts.append(text[unflushed_start:])
    return "".join(out_parts)

def get_replacement(dir_path, is_link, name, link, is_release, abs_path_map):
    if link.startswith("http") or link.startswith("#"):
        return f"[{name}]({link})" if is_link else f"![{name}]({link})"

    link = urllib.parse.unquote(link)
    if is_link:
        parts = link.split("#", 1)
        link_part = parts[0]
        hash_part = parts[1] if len(parts) > 1 else ""
        abs_path = os.path.abspath(os.path.join(dir_path, link_part))
        if abs_path not in abs_path_map:
            raise ValueError(f"Absolute path {abs_path} does not point to a page (for {link=}")
        page_name = abs_path_map[abs_path]
        link_root = PROD_LINK_ROOT if is_release else LOCAL_LINK_ROOT
        ext = ".md" if not is_release else ""
        quote_link = urllib.parse.quote(f"{page_name}{ext}")
        quote_hash = urllib.parse.quote(hash_part)
        return f"[{name}]({link_root}{quote_link}#{quote_hash})"
    
    image_path = os.path.join(dir_path, link)
    if is_release:
        full_image_path = PROD_IMAGE_ROOT + image_path
    else:
        full_image_path = os.path.join(LOCAL_IMAGE_ROOT, image_path)

    return f"![{name}]({full_image_path})"

def populate_data_for_path(file_path, dir_stack, file_name, abs_path_map, order_maps):
    if os.path.isdir(file_path):
        if file_name is not None:
            dir_stack.append(file_name)
        for sub_path in os.listdir(file_path):
            
            populate_data_for_path(os.path.join(file_path, sub_path), dir_stack, sub_path, abs_path_map, order_maps)
        if file_name is not None:
            dir_stack.pop()
    elif os.path.isfile(file_path):
        if file_path.endswith(".md"):
            populate_data_for_file(file_path, dir_stack, file_name, abs_path_map)
        elif file_name == "order.txt":
            populate_data_for_file(file_path, dir_stack, "List of Pages.md", abs_path_map)
            # process order
            prefix = "/".join(dir_stack)+"/"
            with open(file_path, "r", encoding="utf-8") as order_file:
                previous = None
                for current_file in order_file:
                    current_file = current_file.rstrip()
                    
                    if previous is not None:
                        order_maps["prev"][prefix+current_file]=previous
                        order_maps["next"][prefix+previous]=current_file
                    previous = current_file
                
def populate_data_for_file(file_path, dir_stack, file_name, abs_path_map):
    output_name = convert_file_name(dir_stack, file_name)
    abs_path_map[os.path.abspath(file_path)] = output_name

def build_for_path(dir_path, dir_stack, file_name, abs_path_map, is_release, order_maps):
    if file_name is not None:
        file_path = os.path.join(dir_path, file_name)
    else:
        file_path = dir_path
    if os.path.isdir(file_path):
        if file_name is not None:
            dir_stack.append(file_name)
        for sub_path in os.listdir(file_path):
            build_for_path(file_path, dir_stack, sub_path, abs_path_map, is_release, order_maps)
        if file_name is not None:
            dir_stack.pop()
    elif os.path.isfile(file_path):
        if file_path.endswith(".md"):
            build_for_file(dir_path, dir_stack, file_name, abs_path_map, is_release, order_maps)
        elif file_name == "order.txt":
            build_index(dir_path, dir_stack, "List of Pages.md", abs_path_map, is_release)
            

def build_for_file(dir_path, dir_stack, file_name, abs_path_map, is_release, order_maps):
    output_name = convert_file_name(dir_stack, file_name)
    print(f"Build {output_name}")
    build_dir = PROD_BUILD_DIR if is_release else LOCAL_BUILD_DIR
    with open(os.path.join(dir_path, file_name), "r", encoding="utf-8") as input_file:
        key = "/".join(dir_stack)+"/"+file_name
        prev = None
        if key in order_maps["prev"]:
            prev = order_maps["prev"][key]
        next = None
        if key in order_maps["next"]:
            next = order_maps["next"][key]
        
        output_lines = build_file(input_file, dir_path, dir_stack, file_name, abs_path_map, is_release, prev, next)
    
    output_file_path = f"{build_dir}{output_name}.md"
    
    if os.path.exists(output_file_path):
        os.chmod(output_file_path, S_IWRITE|S_IWGRP|S_IWOTH)
    with open(output_file_path, "w+", encoding="utf-8") as output_file:
        output_file.writelines(output_lines)
    os.chmod(output_file_path, S_IREAD|S_IRGRP|S_IROTH)

def build_file(input_iter, dir_path, dir_stack, file_name, abs_path_map, is_release, prev, next):
    output = []
    if dir_stack:
        top_nav = create_top_nav(dir_stack, file_name[:-3], dir_path, is_release, abs_path_map)
        output.append(top_nav+"\n\n")
    
    for line in input_iter:
        output.append(process_page_text(line, dir_path, is_release, abs_path_map))
    if prev is not None or next is not None:
        output.append("\n\n<hr/>\n\n###### ")
        
        if prev is not None:
            prev_link = urllib.parse.quote(prev)
            prev_name = file_path_to_title(prev)
            output.append(process_page_text(f"Previous: [{prev_name}](./{prev_link})", dir_path, is_release, abs_path_map))
        
        if prev is not None and next is not None:
            output.append(" | ")
        
        if next is not None:
            next_link = urllib.parse.quote(next)
            next_name = file_path_to_title(next)
            output.append(process_page_text(f"Next: [{next_name}](./{next_link})", dir_path, is_release, abs_path_map))
    
        output.append("\n")
    return output

def build_index(dir_path, dir_stack, file_name, abs_path_map, is_release):
    output_name = convert_file_name(dir_stack, file_name)
    build_dir = PROD_BUILD_DIR if is_release else LOCAL_BUILD_DIR
    output_lines = []
    if dir_stack:
        top_nav = create_top_nav(dir_stack, file_name[:-3], dir_path, is_release, abs_path_map)
        output_lines.append(top_nav+"\n\n")
    
    with open(os.path.join(dir_path, "order.txt"), "r", encoding="utf-8") as input_file:
        for i, line in enumerate(input_file):
            link = line.rstrip()
            link_quoted = urllib.parse.quote(link)
            link_name = file_path_to_title(link)
            output_lines.append(process_page_text(f"{i+1}. [{link_name}](./{link_quoted})\n", dir_path, is_release, abs_path_map))

    output_file_path = os.path.join(build_dir, output_name+".md")
    if os.path.exists(output_file_path):
        os.chmod(output_file_path, S_IWRITE|S_IWGRP|S_IWOTH)
    with open(output_file_path, "w+", encoding="utf-8") as output_file:
        output_file.writelines(output_lines)    
    os.chmod(output_file_path, S_IREAD|S_IRGRP|S_IROTH)

def convert_file_name(dir_stack, file_name):
    clean_file_name = file_name[:-3].replace(" ","-") # Take out .md in the end
    if dir_stack:
        return "".join([ f"[{dir_name}]" for dir_name in dir_stack])+"-"+clean_file_name
    return clean_file_name

def file_path_to_title(file_path):
    if file_path.endswith("order.txt"):
        folder_name = os.path.basename(os.path.dirname(file_path))
        return f"Subcategory: {folder_name}"
    return os.path.splitext(os.path.basename(file_path))[0]

def create_top_nav(dir_stack, title, dir_path, is_release, abs_path_map):
    top_nav_parts = [f"###### [Home]({PROD_LINK_ROOT})"]
    dir_stack_len = len(dir_stack)
    for i, dir_name in enumerate(dir_stack):
        # i = length -1 => ./
        # i = length -2 => .././
        repeat_times = dir_stack_len - i - 1
        link = "../" * repeat_times + "./order.txt"
        top_nav_parts.append(f"[{dir_name}]({link})")
    top_nav_parts.append(title)
    return process_page_text(" / ".join(top_nav_parts), dir_path, is_release, abs_path_map)

if __name__ == "__main__":
    abs_path_map = {}
    order_maps = {
        "prev": {},
        "next": {}
    }

    populate_data_for_path("src", [], None, abs_path_map, order_maps)
    # print("abs")
    # for key,value in abs_path_map.items():
    #     print(f"{key=}, {value=}")
    # print("prev")
    # for key,value in order_maps["prev"].items():
    #     print(f"{key=}, {value=}")
    # print("next")
    # for key,value in order_maps["next"].items():
    #     print(f"{key=}, {value=}")

    

    is_release = len(sys.argv) > 1 and sys.argv[1] == "release"
    if is_release:
        os.makedirs("release", exist_ok=True)
    else:
        os.makedirs("build", exist_ok=True)

    build_for_path("src", [], None, abs_path_map, is_release, order_maps)
    # with open(sys.argv[1], "r", encoding="utf-8") as file:
    #     text = [ process_page_text(line, False) for line in file ]
    
    # with open("test_out.txt", "w+", encoding="utf-8") as out:
    #     out.writelines(text)
