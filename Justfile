install:
    just packages/celer-vscode-extension/install

ci:
    just packages/celer-vscode-extension/ci

code:
    just packages/celer-code-generator/apply

lint VERBOSE="": code
    python3 scripts/lint.py {{VERBOSE}}
    pylint scripts
    just packages/celer-code-generator/lint
    just packages/celer-vscode-extension/lint

build: code
    just packages/celer-vscode-extension/build
    cargo build

watch PROJECT:
    just packages/{{PROJECT}}/watch

release: code
    just packages/celer-vscode-extension/release
    cargo build --release

clean:
    cargo clean
    rm -rf build
    rm -rf release
    just packages/celer-code-generator/clean
    just packages/celer-vscode-extension/clean

nuke: clean
    just packages/celer-vscode-extension/nuke
