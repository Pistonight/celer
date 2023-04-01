# Change Log
This is the change log for celer-devtool

## `2.3.0` - `03-23-2023` `LATEST`
- Added `-M` `--main` flag to specify a main module other than `main.celer`
- Added `-m` `--module-path` flag to specify a directory/file to load modules, other than the current directory
- Added `-o` `--output` flag to specify a output directory or file.
- The bundler now loads local icons and store them in `_config.icons` as data urls

## `2.2.0` - `03-16-2023`
- Added `-z` `--gzip` flag to bundle to `bundle.json.gz`, which is a gzipped `bundle.json`.
  - In the future, the web app will be able to load this to theoretically be a bit faster
  - The dev server would utilize this to include custom icons in the bundle to send to the web app

## `2.1.0` - `01-01-2023`
- celer-lib update to `2.1.0`

## `2.0.2` - `09-15-2022`
- Fix bug: `True` and `False` not recognized as booleans

## `2.0.1` - `08-22-2022`
- Fix bug: dev server client stuck in close loop if an error occurs on close

## `2.0.0` - `08-17-2022`
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
