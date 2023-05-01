# pylint: disable=line-too-long
"""Execute and verify the result of e2e test. Args: (run <executable>)|(clean) [options]"""
# A test folder contains:
# expected: the expected directory state
# input: the input directory state
# args.txt: the args after celer (e.g. "new" will be "celer new"), one each line
# stdin.txt: the input from stdin
# stdout.expected.txt: the expected output from stdout

# Options: --fail-only                 only print failed tests
#          --test -t <test_name>       run or clean a single test instead of everything
#          --config -c <config_index>  run a single config under a test, only useful if -t is also specified.
#                                      index is 0-based

import filecmp
import os
import shutil
import subprocess
import sys
import toml

PASS = "PASS"
REASON_HAS_ERROR = "FAIL: Command finished with non-zero code or non-empty stderr"
REASON_EXPECT_ERROR = "FAIL: Expected error (non-zero code or non-empty stderr), but there was none"
REASON_ERROR_DIFF = "FAIL: stderr is different from expected"
REASON_STDOUT_DIFF = "FAIL: stdout is different from expected"
REASON_FILE_DIFF = "FAIL: actual directory state is different from expected"

FLAG_FAIL_ONLY = False
CONFIG_INDEX_ONLY = None

def get_configs(test_path):
    """Load config"""
    with open(f"tests/{test_path}/config.toml", "r", encoding="utf-8") as config_file:
        return toml.load(config_file)["test"]

def config_args(config):
    """Get args from config"""
    return config["args"] if "args" in config else None

def config_input_directory(config):
    """Get input from config, default empty array"""
    return config["input"] if "input" in config else []

def config_check_output(config):
    """Get if stdout is in config"""
    return "stdout" in config

def config_input(config):
    """Get stdin from config, default None"""
    return config["stdin"] if "stdin" in config else None

def config_expected_output(config):
    """Get stdout from config"""
    return config["stdout"]

def config_check_directory(config):
    """Get if expected is in config"""
    return "expected" in config

def config_expected_directory(config):
    """Get expected from config"""
    return config["expected"]

def config_has_err(config):
    """Get if err should be expected"""
    return "error" in config and config["error"] is not False

def config_check_err(config):
    """Get if err should be compared"""
    return isinstance(config["error"], str)

def config_expected_err(config):
    """Get error from config"""
    return config["error"]

def dir_match(path1, path2):
    """Return true if 2 dirs match exactly"""
    result = filecmp.dircmp(path1, path2)
    if len(result.left_only) != 0:
        return False
    if len(result.right_only) != 0:
        return False
    return len(result.same_files) == len(result.common_files)

# pylint: disable-next=too-many-arguments, too-many-locals
def verify_test(test_path, return_code, stdout, stderr, config, index):
    """Verify test result. Returns a string"""
    if config_check_output(config):
        expected_stdout_path = f"tests/{test_path}/{config_expected_output(config)}"
        with open(expected_stdout_path, "r", encoding="utf-8") as expected_stdout_file:
            expected_stdout = expected_stdout_file.read()
            output_same = expected_stdout == stdout
            if not output_same:
                return REASON_STDOUT_DIFF

    if config_check_directory(config):
        output_expected_dir =  f"tests/{test_path}/test_output/{index}/expected"
        if not os.path.exists(output_expected_dir):
            os.makedirs(output_expected_dir)

        for expected_dir in config_expected_directory(config):
            full_expected_dir = f"tests/{test_path}/{expected_dir}"
            for subpath_to_copy in os.listdir(full_expected_dir):
                full_src_path = f"{full_expected_dir}/{subpath_to_copy}"
                if os.path.isfile(full_src_path):
                    shutil.copyfile(full_src_path, f"{output_expected_dir}/{subpath_to_copy}")
                elif os.path.isdir(full_src_path):
                    shutil.copytree(full_src_path, f"{output_expected_dir}/{subpath_to_copy}", dirs_exist_ok=True)

        dir_same = dir_match(
            f"tests/{test_path}/test_output/{index}/actual",
            output_expected_dir)
        if not dir_same:
            return REASON_FILE_DIFF

    no_error = len(stderr) == 0 and return_code == 0
    if config_has_err(config):
        if config_check_err(config):
            expected_stderr_path = f"tests/{test_path}/{config_expected_err(config)}"
            with open(expected_stderr_path, "r", encoding="utf-8") as expected_stderr_file:
                expected_stderr = expected_stderr_file.read()
                error_same = expected_stderr == stderr
                return PASS if error_same else REASON_ERROR_DIFF
        # check if there's any error
        return REASON_EXPECT_ERROR if no_error else PASS
    # check if there's no error
    return PASS if no_error else REASON_HAS_ERROR

def find_tests():
    """Find directories under tests folder"""
    tests = []
    for path in os.listdir("tests"):
        if os.path.isdir(f"tests/{path}"):
            if os.path.isfile(f"tests/{path}/config.toml"):
                tests.append(path)
    return tests

def clean_test(test_path):
    """Clean test output"""
    test_dir = f"tests/{test_path}/test_output"
    if os.path.exists(test_dir):
        shutil.rmtree(test_dir)


def run_test(executable, test_path):
    """Run the test"""
    clean_test(test_path)
    test_dir = f"tests/{test_path}/test_output"
    os.mkdir(test_dir)

    configs = get_configs(test_path)
    count = 0
    total = len(configs) if CONFIG_INDEX_ONLY is None else 1
    for i, config in enumerate(configs):
        if CONFIG_INDEX_ONLY is None or CONFIG_INDEX_ONLY == i:
            count += run_test_config(executable, test_path, config, i)

    return count, total

def print_test_start(test, index):
    """Print test start info"""
    if not FLAG_FAIL_ONLY:
        print(f"[ {test} ] {index} ... ", end="", flush=True)

def print_test_result(test, args, index, result, passed):
    """Print test result info"""
    args_string = " ".join(args)
    if FLAG_FAIL_ONLY:
        if not passed:
            print(f"[ {test} ] {index} {result} | {args_string}")
    else:
        print(f"{result} | {args_string}")

# pylint: disable-next=too-many-locals
def run_test_config(executable, test_path, config, index):
    """Run a specific config in a test"""
    print_test_start(test_path, index)

    extra_args = config_args(config)
    if extra_args is None:
        print_test_start(test_path, index)
        print_test_result(test_path, [], index, "FAIL: error: \"args\" not specified", False)
        return 0

    input_dirs = config_input_directory(config)

    test_root_dir = f"tests/{test_path}/test_output/{index}"
    test_dir = f"{test_root_dir}/actual"

    if not os.path.exists(test_dir):
        os.makedirs(test_dir)

    # read command line args
    if executable.endswith(".exe"):
        args = ["PowerShell.exe", "-Command"]
    else:
        args = []
    # cwd will be tests/xxx/test_output/yyy/actual
    args.append(f"../../../../../{executable}")
    args.extend(extra_args)

    # read inputs
    input_content = ""
    input_txt_name = config_input(config)
    if input_txt_name is not None:
        input_txt = f"tests/{test_path}/{input_txt_name}"

        if not os.path.exists(input_txt):
            print_test_result(test_path, extra_args, index, f"FAIL: error: file does not exist: {input_txt}", False)
            return 0
        if not os.path.isfile(input_txt):
            print_test_result(test_path, extra_args, index, f"FAIL: error: stdin not a file: {input_txt}", False)
            return 0

        with open(input_txt, "r", encoding="utf-8") as input_file:
            input_content = input_file.read()

    # Create input dir state
    for input_dir in input_dirs:
        full_input_dir = f"inputs/{input_dir}"
        for subpath_to_copy in os.listdir(full_input_dir):
            full_src_path = f"{full_input_dir}/{subpath_to_copy}"
            if os.path.isfile(full_src_path):
                shutil.copyfile(full_src_path, f"{test_dir}/{subpath_to_copy}")
            elif os.path.isdir(full_src_path):
                shutil.copytree(full_src_path, f"{test_dir}/{subpath_to_copy}")

    # Run test
    result = subprocess.run(
        args,
        text=True,
        capture_output=True,
        check=False,
        input=input_content,
        cwd=test_dir)

    with open(f"{test_root_dir}/stdout.txt", "w+", encoding="utf-8") as stdout_file:
        stdout_file.write(result.stdout)
    with open(f"{test_root_dir}/stderr.txt", "w+", encoding="utf-8") as stderr_file:
        stderr_file.write(result.stderr)
        stderr_file.write("\n\n")
        stderr_file.write("// The following are generated by the e2e test and is not part of stderr\n")
        stderr_file.write(f"Exit Status: {result.returncode}\n")

    test_result = verify_test(test_path, result.returncode, result.stdout, result.stderr, config, index)
    passed = test_result == PASS
    print_test_result(test_path, extra_args, index, test_result, passed)
    return 1 if passed else 0

# pylint: disable-next=too-many-branches
def main():
    """Main"""
    #pylint: disable-next=global-statement
    global FLAG_FAIL_ONLY
    #pylint: disable-next=global-statement
    global CONFIG_INDEX_ONLY
    command = sys.argv[1]

    tests = find_tests()
    test = None

    for i, arg in enumerate(sys.argv[3:]):
        if arg == "--fail-only":
            FLAG_FAIL_ONLY = True
        elif arg in ("--test", "-t"):
            test = sys.argv[i+4]
        elif arg in ("--config", "-c"):
            CONFIG_INDEX_ONLY = int(sys.argv[i+4])

    if test is not None and test not in tests:
        print(f"Test not found: {test}")
        return 3

    if command == "test":
        executable = sys.argv[2]
        total_passed = 0
        total_tests = 0
        if test is not None:
            total_passed, total_tests = run_test(executable, test)
        else:
            CONFIG_INDEX_ONLY = None

            for test in tests:
                passed, total = run_test(executable, test)
                total_passed+=passed
                total_tests+=total

        print()
        print(f"{total_passed}/{total_tests} passed")
        return 0 if total_passed == total_tests else 1

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
