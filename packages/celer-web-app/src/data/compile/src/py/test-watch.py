# Test system. This script watches changes and recompiles the bundler, then runs the test
# This script won't work outside of the repo

# Usage: py gtest-watch.py
# Output: bundle.json, bundler.js, bundle.raw.json

# PY_INJECT

def __main__():
    inputFile = "test"
    print(f"Building... {inputFile}")
    rebuildBundle(inputFile)

    observer = watch_start(inputFile, rebuildBundle)
    watch_loop()
    watch_stop(observer)


def rebuildBundle(inputFile):
    rebundleHelper(inputFile, True, False, tscompileAndInvokeBundler)
    print("=====")
    with open('test/expected.json', "r") as expectedIn:
        expected = " ".join(line for line in expectedIn)
        with open(BUNDLE_JSON, "r") as actualIn:
            actual = " ".join(line for line in actualIn)
            if expected == actual:
                print("PASS: bundle.json and test/expected.json are the same")
            else:
                print("FAIL: bundle.json and test/expected.json are not the same")
    print("")

__main__()
