"""Execute and verify the result of e2e test. Args: (run <executable>)|(clean) [options]"""
# A test folder contains:
# expected: the expected directory state
# input: the input directory state
# args.txt: the args after celer (e.g. "new" will be "celer new"), one each line
# stdin.txt: the input from stdin
# stdout.expected.txt: the expected output from stdout

# Options: --fail-only               only print failed tests
#          --test -t <test_name>     run a single test instead of everything

import filecmp
import os
import shutil
import subprocess
import sys

PASS = "PASS"
REASON_STDOUT_DIFF = "FAIL: stdout is different"
REASON_FILE_DIFF = "FAIL: result directory state is different"

FLAG_FAIL_ONLY = False

def dir_match(path1, path2):
    """Return true if 2 dirs match exactly"""
    result = filecmp.dircmp(path1, path2)
    if len(result.left_only) != 0:
        return False
    if len(result.right_only) != 0:
        return False
    return len(result.same_files) == len(result.common_files)

def verify_test(test_path):
    """Verify test result. Returns a string"""
    output_same = filecmp.cmp(
        f"tests/{test_path}/stdout.txt",
        f"tests/{test_path}/stdout.expected.txt")
    if not output_same:
        return REASON_STDOUT_DIFF
    dir_same = dir_match(f"tests/{test_path}/test_output", f"tests/{test_path}/expected")
    if not dir_same:
        return REASON_FILE_DIFF
    return PASS

def find_tests():
    """Find directories under tests folder"""
    tests = []
    for path in os.listdir("tests"):
        if os.path.isdir(f"tests/{path}"):
            tests.append(path)
    return tests

def clean_test(test_path):
    """Clean test output"""
    test_dir = f"tests/{test_path}/test_output"
    if os.path.exists(test_dir):
        shutil.rmtree(test_dir)
    stdout_txt = f"tests/{test_path}/stdout.txt"
    if os.path.exists(stdout_txt):
        os.remove(stdout_txt)

    stderr_txt = f"tests/{test_path}/stderr.txt"
    if os.path.exists(stderr_txt):
        os.remove(stderr_txt)


def run_test(executable, test_path):
    """Run the test"""
    clean_test(test_path)

    test_dir = f"tests/{test_path}/test_output"

    # read commands
    args = [executable]
    with open(f"tests/{test_path}/args.txt", "r", encoding="utf-8") as args_file:
        for line in args_file:
            args.append(line.rstrip())

    if not FLAG_FAIL_ONLY:
        print(f"Running [ {test_path} ] ... ", end="")
    # read inputs
    input_txt = f"tests/{test_path}/stdin.txt"
    input_content = ""
    if os.path.exists(input_txt):
        with open(input_txt, "r", encoding="utf-8") as input_file:
            input_content = input_file.read()

    # copy input to test_output
    shutil.copytree(f"tests/{test_path}/input", test_dir)

    # Run test
    result = subprocess.run(
        args,
        stdout=subprocess.PIPE,
        stderr=subprocess.PIPE,
        text=True,
        check=False,
        input=input_content,
        cwd=test_dir)

    with open(f"tests/{test_path}/stdout.txt", "w+", encoding="utf-8") as stdout_file:
        stdout_file.write(result.stdout)
    with open(f"tests/{test_path}/stderr.txt", "w+", encoding="utf-8") as stderr_file:
        stderr_file.write(result.stderr)

    test_result = verify_test(test_path)
    passed = test_result == PASS
    if FLAG_FAIL_ONLY:
        if not passed:
            print(f"[ {test_path} ] {test_result}")
    else:
        print(test_result)
    return 1 if passed else 0

def main():
    """Main"""
    #pylint: disable-next=global-statement
    global FLAG_FAIL_ONLY
    command = sys.argv[1]
    
    test = None
    for i, arg in enumerate(sys.argv[3:]):
        if arg == "--fail-only":
            FLAG_FAIL_ONLY = True
        elif arg in ("--test", "-t"):
            test = sys.argv[i+4]

    if command == "test":
        executable = sys.argv[2]
        if test is not None:
            passed = run_test(executable, test) == 1
            return 0 if passed else 1
        tests = find_tests()
        passed = 0
        for test in tests:
            passed += run_test(executable, test)
        print(f"{passed}/{len(tests)} passed")
        return 0 if passed == len(tests) else 1

    if command == "clean":
        if test is not None:
            clean_test(test)
        else:
            tests = find_tests()
            for test in tests:
                clean_test(test)
            print(f"Cleaned {len(tests)} tests")
        return 0

    print(f"Unknown command {command}")
    return 2

if __name__ == "__main__":
    print()
    EXIT_CODE = main()
    print()
    sys.exit(EXIT_CODE)
