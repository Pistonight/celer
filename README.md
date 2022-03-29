**We are currently migrating to a monorepo**

# celer
Celer is an engine for maintaining route documents for *The Legend of Zelda: Breath of the Wild* Speedruns

## Packages

#### celer-web-app
**WIP** React frontend

#### celer-cli
**WIP** CLI for writing routes, written in Rust

#### celer-lib
**WIP** Rust library for celer. It is used both in cli and the web app

#### [celer-code-generator](https://github.com/iTNTPiston/celer/tree/main/packages/celer-code-generator)

Utility to generate code from csv files with game data (such as Koroks, Shrines, etc)

#### [celer-vscode-extension](https://github.com/iTNTPiston/celer/tree/main/packages/celer-vscode-extension)

An extension for VS Code that adds syntax highlighting and auto completion for celer route files

#### [celer-user-docs](https://github.com/iTNTPiston/celer/tree/main/packages/celer-user-docs)

Documentation for users

## Contributing

Need to install node 16, rust and python 3

Python modules:
- toml
- pyyaml
- pylint
- pylint-quotes

or run `python3 -m pip install toml pyyaml pylint pylint-quotes`

Rust crates:
- just
- wasm-pack

or run `cargo install just wasm-pack`

A linux/WSL environment is needed.
