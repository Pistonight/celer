# celer
Celer is an engine for maintaining route documents for *The Legend of Zelda: Breath of the Wild* Speedruns

## Packages

#### [celer-web-app](https://github.com/iTNTPiston/celer/tree/main/packages/celer-web-app)
React web app for rendering routes. Currently the engine is written in typescript, but the plan is to migrate to rust to allow code sharing between web app and CLI

#### [celer-devtool](https://github.com/iTNTPiston/celer/tree/main/packages/celer-devtool)
A command line util for route makers to initialize, bundle, and preview their routes locally (WIP)

#### celer-lib
Rust library for celer. It is used both in cli and the web app

#### [celer-code-generator](https://github.com/iTNTPiston/celer/tree/main/packages/celer-code-generator)

Utility to generate code from csv files with game data (such as Koroks, Shrines, etc)

#### [celer-vscode-extension](https://github.com/iTNTPiston/celer/tree/main/packages/celer-vscode-extension)

An extension for VS Code that adds syntax highlighting and auto completion for celer route files

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
