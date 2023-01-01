This tutorial will explain step customization in detail

# Basic Syntax
You probably already seen the basic syntax for customizing a step in the [previous tutorial](./Route%2C%20Sections%2C%20and%20Steps.md)
```yaml
_route: # route object
  - Section 1: # customized steps must be inside sections
    - customized step:                 # <step name>:
        notes: Don't forget to do this #   <property1>: <value1>
        icon: chest                    #   <property2>: <value2>
        ...
```

# Properties
The following table contains the properties you can set. More might be added in the future

|Property|Use|
|-|-|
|text|Override the text of the step. This is usually useless since you can just write it as the the step name|
|icon|Add/override the icon of the step. [Available icons](https://github.com/iTNTPiston/celer/tree/main/packages/celer-web-app/src/data/image). Don't include the `.png` extension when specifying the icon|
|comment|Add/override the secondary line of the step. **Only works if the step also has an icon**|
|notes|Add notes to the step|
|line-color|Change line color on the map. Colors are specified with html syntax, such as `red`, `#ff0000`, or `rgb(255,0,0)`|
|hide-icon-on-map|True/False. If true, the icon of this step won't show on map|
|coord|`[x, z]` or `[x, y, z]`. Location of this step. Can copy direction from objmap|
|movements|See [Movements](#movements) section|
|split-type|Add/override the split type of this step. Valid values are case sentivity name of [the SplitType enum](https://github.com/iTNTPiston/celer/tree/main/packages/celer-web-app/src/core/compiler/types.ts)|
|var-change|A map of variables to update|
|fury|Number of furies to use. Used together with the `.fury()` [typed string](./Typed%20String%20System.md)|
|gale|Number of gales to use. Used together with the `.gale()` [typed string](./Typed%20String%20System.md)|
|time-override|Override the time this step takes, in seconds. Used for checking recharging times. (Normally the engine estimates the time the step takes by its type|
|commands|A list of commands for the engine to execute. Valid commands are `EnableFuryPlus`, `EnableGalePlus` and `ToggleHyruleCastle`|
|suppress|A list of errors to suppress, such as `FuryRecharge`. You can see the error name in the error/warning banner that shows up|

### Movements
You can set up complex movements on the map within one step.

The `movements` property is an array of objects with 3 properties: `to`, `warp`, `away`. `to` is the coordinate and is required, the other two are flags that are not required and are both default to `false`. The coordinate can be either `[x, z]` or `[x, y, z]`
```yaml
_route: # route object
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
