# List the commands
list:
    @just -l

# Install node packages
install:
    just packages/celer-vscode-extension/install
    just packages/celer-web-app/install

# Check generated code are update to date
check:
    just packages/celer-code-generator/verify

# Check versions are consistent in packages
vsync: 
    python3 scripts/version.py

# Invoke code generator
buildc:
    @just packages/celer-code-generator/apply

# Lint TS code
lintts:
    @just packages/celer-vscode-extension/lint
    @just packages/celer-web-app/lint

# Lint RS code
lintrs:
    python3 scripts/rsvalidateimport.py packages/celer-devtool/src packages/celer-lib/src
    cargo clippy --release -- -D clippy::all -D warnings

# Lint PY code
lintpy VERBOSE="":
    python3 scripts/lint.py {{VERBOSE}}
    pylint scripts
    @just packages/celer-code-generator/lint
    @just packages/celer-e2e-test/lint

# Lint everything. Run this before push/PR
lint: check vsync
    @just lintpy
    @just lintts
    @just lintrs

# Test everything
test: check
    @just testu
    @just teste2e
    
# Unit Test
testu: testrs testts
# Test rust code
testrs:
    cargo test

testts:
    @echo "There's no tests for TS at the moment"

# (Devtool) Integration tests
teste2e:
    @just packages/celer-e2e-test/test
teste2e-windows:
    @just packages/celer-e2e-test/test ".exe"

# Only build RS. Pass in --release for ship builds
buildrs RELEASE="":
    cargo build {{RELEASE}}

# Build everything
build: buildc buildrs
    @just packages/celer-vscode-extension/build
    @just packages/celer-web-app/build

# Produce release artifacts and binaries
release: buildc
    mkdir -p release
    cargo build --release 
    @just packages/celer-vscode-extension/release
    @just packages/celer-web-app/release
    
    python3 scripts/release.py > release/RELEASE_NOTES.txt

# Clean build outputs
clean:
    cargo clean
    rm -rf build
    rm -rf release
    @just packages/celer-code-generator/clean
    @just packages/celer-vscode-extension/clean
    @just packages/celer-web-app/clean
    @just packages/celer-e2e-test/clean

# Clean everything, including node modules
nuke: clean
    @just packages/celer-vscode-extension/nuke
    @just packages/celer-web-app/nuke
