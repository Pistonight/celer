# Change Log
This is the change log for celer-devtool

## `2.0.0` - `08-17-2022` `LATEST`
- Improved command line arg parsing with `clap`
  - `version` and `help` subcommands are now changed to `clap` defaults
- Added `build` subcommand
  - Added `bundle` build target. This is the default target which will produce `bundle.json`
  - Added `merge` build target (`build --target merge`) for debugging. This will produce `source.json`, which is the input to bundler.
- Running dev server now produces `bundle.json` automatically
  - use `--no-emit-bundle` option to not do this
- Other options:
  - Most commands have a `--debug` option to prettify the json output for debugging
  - See `celer --help` for detail about new commands

## `1.1.0` - `04-28-2022`
- Add `new` and `dev` command

## `1.0.0` - `04-04-2022`
- Add `version` and `help` command
