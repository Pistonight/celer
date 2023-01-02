If your route gets large, you may want to split it to multiple sections, or even multiple files or directories for better organization and maintainability. The devtool will bundle the files together and generate 1 single `bundle.json` for distribution.

# `__use__`
The `__use__` directive is used to achieve this.
```yaml
_route: # route object
  - Section 1: __use__ MySection

MySection:
  - step 1
  - step 2
  # ...
# ...
# The devtool will bundle it into:

Route: # route object
  - Section 1:
    - step 1
    - step 2
    # ...
```
You can also have multiple nested modules
```yaml
_route: # route object
  - Section 1:
    - __use__ split 1
    - __use__ split 2
    # ...

split 1:
  - do this
  - do that

split 2:
  - get this
  - get that
# ...
# The devtool will bundle it into:

_route: # route object
  - Section 1:
    - do this
    - do that
    - get this
    - get that
    # ...

```
# Reusing Modules
This also supports reusing modules
```yaml
_route: # route object
  - Section 1:
    - __use__ Monument
    - do something else
    - __use__ Monument
    - do something else
    # ...

Monument:
  .loc(Monument):
    notes: ONLY MASH B
# ...
# The devtool will bundle it into:

_route: # route object
  - Section 1:
    - .loc(Monument):
        notes: ONLY MASH B
    - do something else
    - .loc(Monument):
        notes: ONLY MASH B
    - do something else
    # ...
```
Passing parameters to a module is not supported. A system that does similar things is planned but not implemented yet

# Multiple Files
You can also split up the route into multiple files.
```yaml
# file: main.celer
_route: # route object
  - Section 1:
    - __use__ split 1
    - __use__ split 2
    # ...

# file: a.celer
split 1:
  - do this
  - do that

# file: b.celer
split 2:
  - get this
  - get that

```

The devtool will recursively load all `.celer` files in the directory. Note that even the modules are split across files, you still refer to them using the same name. For this reason, module names cannot be repeated. The devtool does not check duplicate names, so if there are duplicate, an arbitrary one is kept.

# Circular Dependency
The devtool does have circular dependency protection
```yaml
_route:
  - Section 1:
    - __use__ A
    # ...

A: __use__ B
B: __use__ A # Error! Circular Dependency: Route -> A -> B -> A

```
The bundler will still generate a bundle, which contains the error message instead of the route
```yaml
_route:
  - Bundler Error! Circular Dependency Detected ...
```
You will see the message when loading the bundle using the engine. The error message will contain the dependency chain for you to debug
