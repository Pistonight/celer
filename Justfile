install:
    just packages/celer-vscode-extension/install

lint:
    scripts/lint.py
    pylint scripts
    just packages/celer-code-generator/lint
    just packages/celer-vscode-extension/lint

build: 
    just packages/celer-code-generator/apply
    just packages/celer-vscode-extension/build
    cargo build

watch PROJECT:
    just packages/{{PROJECT}}/watch

release: build
    just packages/celer-vscode-extension/release

clean:
    cargo clean
    rm -rf build
    rm -rf release
    just packages/celer-code-generator/clean
    just packages/celer-vscode-extension/clean

nuke: clean
    just packages/celer-vscode-extension/nuke
    