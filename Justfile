install:
    just packages/celer-vscode-extension/install
    just packages/celer-web-app/install

ci:
    just packages/celer-vscode-extension/ci
    just packages/celer-web-app/ci

check:
    just packages/celer-code-generator/verify

code:
    just packages/celer-code-generator/apply

version: 
    python3 scripts/version.py

lint VERBOSE="": check code version
    python3 scripts/lint.py {{VERBOSE}}
    pylint scripts
    just packages/celer-code-generator/lint
    just packages/celer-vscode-extension/lint
    just packages/celer-web-app/lint

cargo RELEASE="":
    cargo build {{RELEASE}}

build: code
    just packages/celer-vscode-extension/build
    just packages/celer-web-app/build
    cargo build

watch PROJECT:
    just packages/{{PROJECT}}/watch

release: code
    mkdir -p release
    just packages/celer-vscode-extension/release
    just packages/celer-web-app/release
    just packages/celer-user-docs/release
    cargo build --release
    python3 scripts/release.py > release/RELEASE_NOTES.txt

clean:
    cargo clean
    rm -rf build
    rm -rf release
    just packages/celer-code-generator/clean
    just packages/celer-vscode-extension/clean
    just packages/celer-web-app/clean

nuke: clean
    just packages/celer-vscode-extension/nuke
    just packages/celer-web-app/nuke
