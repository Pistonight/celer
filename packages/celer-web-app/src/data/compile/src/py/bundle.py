# This is a standalone bundler. You can use this script by itself
# The output is a minimized JSON, which can be distributed

# Usage: py gbundle.py <inputPath>
# Output: bundle.json

# PY_INJECT

def __main__():
    if len(sys.argv) < 2:
        print(f"Usage: {sys.argv[0]} <input> ")
        sys.exit(1)

    inputFile = sys.argv[1]
    print(f"Bundling... {inputFile}")
    rebuildBundle(inputFile)

def rebuildBundle(inputFile):
    rebundleHelper(inputFile, False, True, invokeJsBundle)

def invokeJsBundle(obj):
# JS_INJECT_NEXT_LINE
    return dukpy.evaljs("JS_INJECT", input=obj)

__main__()
