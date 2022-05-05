# celer-vscode-extension

Extension for editing route documents for Celer Engine, a routing engine for BOTW speedrun

## Features

 - Syntax highlighting
 - Auto completion for presets and functions

![Demo](https://raw.githubusercontent.com/iTNTPiston/celer/main/packages/celer-vscode-extension/images/Demo.gif)

## Known Issues

 - Auto completion is only triggered by `_` or `:` for presets, and `.` for functions (i.e. not triggered if you already typed the `_` or `:`, or in the middle of the word). A workaround is to restart typing from the special character if you need completion
 - Partially color regular yaml files. Workaround for this is to temporarily disable the extension if you need to work with yaml files

## Release Notes

### 3.0.0

Fixing spelling errors

### 1.0.0

Initial release
