# build.py: A compiler for the compiler
import dukpy

JS_INJECT = "\"JS_INJECT\""
JS_INJECT_NEXT_LINE = "# JS_INJECT_NEXT_LINE"
PY_INJECT = "# PY_INJECT"

bundlerJs=""
for tsSourceName in ["version.ts", "type.ts", "switch.ts", "RouteScriptBundler.ts"]:
    with open(f'src/ts/{tsSourceName}', "r") as tsSrc:
        print(f"Compiling... {tsSourceName}")
        bundlerJs += f"/// {tsSourceName}\n"
        bundlerJs += dukpy.typescript_compile("".join(line for line in tsSrc)  )

with open('src/js/system.js', "r") as systemSrc:
    systemJs = " ".join(line for line in systemSrc)

with open('src/js/invoke.js', "r") as invokeSrc:
    invokeJs = " ".join(line for line in invokeSrc)

jsCode = systemJs + bundlerJs + invokeJs

# Escape hell: Need to double escape the escape sequences.. currently only \" is used
jsCode = jsCode.replace("\\\"", "\\\\\\\"")

with open('src/py/common.py', "r") as commonSrc:
    commonPy = "".join(line for line in commonSrc)

for pyFile in ["bundle.py", "bundle-watch.py", "test-watch.py", "dev-watch.py"]:
    with open(f'src/py/{pyFile}', "r") as pySrc:
        pyLines = pySrc.readlines()
        print(f"Injecting... {pyFile}")
        outLines = [
            "# WARNING: This is a generated file\n",
            "# You can edit it for prototyping, but please submit changes to the corresponding file in src/py\n",
            "\n"
        ]
        inject = False
        for l in pyLines:
            if inject:
                l = l.replace(JS_INJECT, f"\"\"\"{jsCode}\"\"\"")
                inject = False
            if l.strip() == JS_INJECT_NEXT_LINE:
                inject = True
            if l.strip() == PY_INJECT:
                l = commonPy

            outLines.append(l)
    with open(f"g{pyFile}", "w+") as pyOut:
        print("Emitting...")
        pyOut.writelines(outLines)
