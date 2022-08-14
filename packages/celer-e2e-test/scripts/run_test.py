"""Execute and verify the result of e2e test. Input the executable and test name (folder)"""
# The folder contains:
# expected: the expected directory state
# input: the input directory state
# args.txt: the args after celer (e.g. "new" will be "celer new"), one each line
# stdin.txt: the input from stdin
# stdout.expected.txt: the expected output from stdout

import filecmp
import os
import shutil
import subprocess

def dir_match(path1, path2):
    """Return true if 2 dirs match exactly"""
    result = filecmp.dircmp(path1, path2)
    if len(result.left_only) != 0:
        return False
    if len(result.right_only) != 0:
        return False
    return len(result.same_files) == len(result.common_files)

def run_test(executable, test_path):
    """Run the test"""
    dir = f"{test_path}/test_output"
    if(os.path.exists(dir)):
        shutil.rmtree(dir)
    
    # read commands
    args = [executable]
    with open(f"{test_path}/args.txt", "r", encoding="utf-8") as args_file:
        for line in args_file:
            args.append(line)
    # read inputs
    input_txt = f"{test_path}/stdin.txt"
    input = ""
    if os.path.exists(input_txt):
        with open(input_txt, "r", encoding="utf-8") as input_file:
            input = input_file.read()

    # copy input to test_output
    shutil.copytree(f"{test_path}/input", dir)

    # Run test
    result = subprocess.run(
        args, 
        stdout=subprocess.PIPE, 
        stderr=subprocess.PIPE, 
        text=True, 
        input=input,
        cwd=dir)

    with open(f"{test_path}/stdout.txt", "w+", encoding="utf-8") as stdout_file:
        stdout_file.write(result.stdout)
    with open(f"{test_path}/stderr.txt", "w+", encoding="utf-8") as stderr_file:
        stderr_file.write(result.stderr)


run_test("ls", "test_new")
