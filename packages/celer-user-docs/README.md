# Celer User Documentation
Version: `2.0.0`

## Sections
1. [Introduction](#introduction)
2. [Install Celer CLI (WIP)](#install-celer-cli)
3. [Install VS Code Extension](#install-celer-vs-code-extension)
4. [Writing Routes](#writing-routes)
    1. [Getting Started](#getting-started)
    2. [Project Section](#project-section)
    3. [Route Section](#route-section)
    4. [Step Customization](#step-customization)
    5. [Movements](#movements)
    6. [Presets](#presets)
    7. [String Typing](#string-typing)
    8. [Modular Route](#modular-route)
****
## Introduction
Celer is a route engine for BOTW with features designed to make it easier to maintain the route.

The features include
- Automatically count Koroks, Shrines, etc.
- Internal variable management, such as counting rushrooms or tails
- Champion ability validation, such as checking if the ability has recharged
- Generating `.lss` split file for livesplit
- Viewing the route doc side-by-side with a map
- Generating objmap file

Essentially, celer allows router maintainer to make route changes without doing the boring book-keeping. If you are tired of updating hundreds of korok numbers when making changes, celer is for you.
****
## Install Celer CLI

**NOTE: The newer rust-based CLI is still in development. Please use the python-based bundler at [iTNTPiston/celer-compiler](https://github.com/iTNTPiston/celer-compiler)**

**Note that the instructions in that repo is out-dated. Please refer to this user guide instead.**

****

## Install/Update Celer VS Code Extension

If you use VS Code, you can install an extension to help with writing the route doc.

1. Download the `.vsix` file from the latest release
2. Run `code --install-extension <path_to_vsix file>` from command line
   - If you prefer to install from UI, go to the `Extensions` section from side bar within VS Code, Click on the 3 dots near the top of the side panel (`Views and More Actions...`), and choose `Install from VSIX...`

To update, simply install the newer `.vsix` and the old one will be automatically removed by VS Code.

To uninstall, run `code --uninstall-extension itntpiston.celer` or uninstall from within VS Code like you do with other extensions

## Writing Routes
Celer routes are files that end with `.celer` extension. These files are text files in YAML format

**Note that yaml format is indentation sentitive. Make sure your scripts are indented correctly if you see any parse errors**

1. [Getting Started](#getting-started)
2. [Project Section](#project-section)
3. [Route Section](#route-section)
4. [Step Customization](#step-customization)
5. [Movements](#movements)
6. [Presets](#presets)
7. [String Typing](#string-typing)
8. [Modular Route](#modular-route)

### Getting Started
The basic format of the route script is like this:
```yaml
Project: 
  Name: My Project
  Authors: [Your Name]
  Version: "1.2.3"
  Description: An example project
  Url: something.something.else

Route:
  - Section 1:
    - Get the sword
    - Get the shield
    - Do some quests
  - Section 2:
    - Kill the boss
```
Copy and paste the content into `myroute.yaml`, and then run `gbundle-watch.py myroute.yaml`, you can then use the web app to render the doc [(link)](https://celer.itntpiston.app/#/pydev)

### Project Section
Project section is this
```yaml
Project: 
  Name: My Project
  Authors: [Your Name]
  Version: "1.2.3"
  Description: An example project
  Url: something.something.else
```
This section defines the metadata of the route and is required

### Route Section
The Route section defines the route itself. The route is an array of sections, and each section is a section name and an array of steps
```yaml
Route: # route object
  # array of sections
  - Section 1: # section name
    # array of steps
    - Get the sword
    - Get the shield
    - Do some quests
  - Section 2:
    - Kill the boss
```

Steps can also exist outside of sections
```yaml
Route: # route object
  - some steps
  - outside
  - section
  - Section 1:
    - steps inside section
```

### Step Customization
Each step can be customized with various properties
```yaml
Route: # route object
  - Section 1:
    - normal step
    - customized step:
        notes: Don't forget to do this # A step with a custom notes
    - another normal step
```
The following table contains the properties you can set. The ones prefixed with \* are planned but not implemented yet. 

|Property|Use|
|-|-|
|text|Override the text of the step|
|icon|Add/override the icon of the step. [Available icons](https://github.com/iTNTPiston/celer/tree/main/packages/celer-web-app/src/data/image). Don't include the `.png` extension when specifying the icon|
|comment|Add/override the comment. Only works if the step also has an icon|
|notes|Add notes to the step|
|line-color|Change line color on the map. Colors are specified with html syntax, such as `red`, `#ff0000`, or `rgb(255,0,0)`|
|hide-icon-on-map|True/False. If true, the icon of this step won't show on map|
|coord|`[x, z]` or `[x, y, z]`. Location of this step. Can copy direction from objmap|
|movements|See [Movements](#movements) section|
|split-type|Add/override the split type of this step. Valid values are case sentivity name of [the SplitType enum](https://github.com/iTNTPiston/celer/tree/main/packages/celer-web-app/src/data/assembly/types.ts)|
|var-change|A map of variables to update|
|fury|Number of furies to use|
|gale|Number of gales to use|
|time-override|Override the time this step takes, in seconds. Used for checking recharging times. (Normally the engine estimates the time the step takes by its type|
|*suppress|True/False. Engine errors generated by this step will become warning (e.g. Fury might not be back). Note that Compiler Errors are not suppressed|
|commands|A list of commands for the engine to execute. Valid commands are `EnableFuryPlus`, `EnableGalePlus` and `ToggleHyruleCastle`|

### Movements
You can set up complex movements on the map within one step.

The `movements` property is an array of objects with 3 properties: `to`, `warp`, `away`. `to` is the coordinate and is required, the other two are flags that are not required and are both default to `false`. The coordinate can be either `[x, z]` or `[x, y, z]`
```yaml
Route: # route object
  - Section 1:
    - a lot of movements:
        movements:
          - to: [3840,-418.89699834118073] # move to a location
          - to: [3808,-8.734572648428184] # another location
            away: true # away is set, so the player doesn't actually move (like shooting something faraway, or drown fall)
          - to: [2517.50, 182.50, -212.48] # another location
            warp: true # Warping to this location. No arrow would be drawn for this movement
          - to: [2085.79, 129.79, 181.66] # another location
            away: true 
            warp: true # if both away and warp are set, only away is considered. Warp has no effect
```
The `coord` property is actually a short hand for `movements`. If both are set, `coord` will be ignored
```yaml
- some step:
    movements:
      - to: [3840,-418.89699834118073] # move to a location

# ...is the same as

- some step:
    coord: [3840,-418.89699834118073]
```

### Presets
There are presets supported by the engine so you don't have to define each step from scratch.

If the text of a step matches a preset, the preset will be applied
```yaml
Route: # route object
  - Section 1:
    - normal step
    - _Chest<My Precious> # Get item from a chest
    - another normal step
```
Of course, presets can also be further customized
```yaml
Route: # route object
  - Section 1:
    - _Equipment::Shield<Pot Lid>:
        comment: DO NOT BREAK
```
The web app has a [docs page](https://celer.itntpiston.app/#/docs/presets) that shows all supported presets

### String Typing
Most strings in the route engine supports adding a type to the string, which will cause the doc to be rendered using custom color.
To add a type to a string `abc`, surround it with parentheses and prefix it with `.<type>`. For example `.item(abc)` marks the string as type `item`

Full example:
```yaml
Route: # route object
  - Section 1:
    - normal step
    - .item(I am an item)
    - .boss(I am boss)
    - WB .dir(N) + .dir(E)
    - .gale():
        gale: 1
```

You can use `.(` and `..)` to escape a type expression. For example, `.(.item(abc)..)` will render as `.item(abc)`, as a normal type instead of item type

The table below summarizes all available types. Most types differ simply by color, but there are some that adds extra functionality
|Type|Description|
|-|-|
|item|Show string in item color|
|loc|Show string in location color|
|npc|Show string in npc color|
|rune|Show string in rune color|
|boss|Show string in boss color|
|enemy|Show string in enemy color|
|!!|Show string in important color|
|code|Show string in a unicode font|
|dir|Show string as direction. If the string inside is recognized as a compass or clock direction, you can toggle the direction mode by using the options menu **WIP**|
|link|Show string as clickable link|
|v|Display a variable. The string inside the parenthesis is the name of the variable. (Variables can be modified using the `var-change` property|
|gale/fury|Display gale/fury string. This type doesn't take any input (i.e. use `.gale()` or `.fury()`). When `gale` or `fury` property is specified, this string will display the usage of gale or fury (e.g. `GALE 1-2` or `FURY 3`). The engine will generate an error if the corresponding property is not specified|

Currently, typed strings are supported in: text, comment (second line of text next to icon), notes and banners

### Modular Route
If your route gets large, you may want to split it to multiple sections, or even multiple files or directories for better organization and maintainability

You can use the `__use__` directive to do that
```yaml
Route: # route object
  - Section 1: __use__ MySection

MySection:
  - step 1
  - step 2
  # ...
# ...
# The bundler will bundle it into:

Route: # route object
  - Section 1: 
    - step 1
    - step 2
    # ...
```
You can also have multiple nested modules
```yaml
Route: # route object
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
# The bundler will bundle it into:

Route: # route object
  - Section 1: 
    - do this
    - do that
    - get this
    - get that
    # ...

```
#### Reusing Modules
This also supports reusing modules
```yaml
Route: # route object
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
# The bundler will bundle it into:

Route: # route object
  - Section 1: 
    - .loc(Monument):
        notes: ONLY MASH B
    - do something else
    - .loc(Monument):
        notes: ONLY MASH B
    - do something else
    # ...
```
Passing parameters to a module is not supported. There's no current plan to support it

#### Multiple Files
You can also split up the route into multiple files.
```yaml
# file: main.yaml
Route: # route object
  - Section 1: 
    - __use__ split 1
    - __use__ split 2
    # ...

# file: a.yaml
split 1:
  - do this
  - do that

# file: b.yaml
split 2:
  - get this
  - get that

```
When using the bundler scripts, you can pass in a directory instead of a file, for example: `py gbundle.py .` (dot means current directory)

The bundler will recursively load all `.yaml` files in the directory. Note that even the modules are split across files, you still refer to them using the same name. For this reason, module names cannot be repeated. The bundler does not check duplicate names, so if there are duplicate, an arbitrary one is kept.

#### Circular Dependency
The bundler does have circular dependency protection
```yaml
Route:
  - Section 1: 
    - __use__ A
    # ...

A: __use__ B
B: __use__ A # Error! Circular Dependency: Route -> A -> B -> A

```
The bundler will still generate a bundle, which contains the error message instead of the route
```yaml
Route:
  - Bundler Error! Circular Dependency Detected ...
```
You will see the message when loading the bundle using the engine. The error message will contain the dependency chain for you to debug
