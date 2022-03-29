# Dev system. This script watches changes and recompiles the bundler and rebundles the script
# This script won't work outside of the repo
# Output is also hosted on your local computer, which can be used for integration testing with the engine side

# Usage: py gdev-watch.py <inputPath> [<port>]
# Output: bundle.json, bundler.js, bundle.raw.json
# If port is not specified, default port is 2222

# PY_INJECT

def __main__():
    if len(sys.argv) < 2:
        print(f"Usage: {sys.argv[0]} <input> [<port>]")
        sys.exit(1)

    inputFile = sys.argv[1]
    port = 2222

    if len(sys.argv) > 2:
        port = int(sys.argv[2])
    else:
        print(f"Using default port {port}")
    print(f"Building... {inputFile}")
    rebuildBundle(inputFile)

    observer = watch_start(inputFile, rebuildBundle)
    host_loop(port)
    watch_stop(observer)


def rebuildBundle(inputFile):
    rebundleHelper(inputFile, True, False, tscompileAndInvokeBundler)

__main__()
