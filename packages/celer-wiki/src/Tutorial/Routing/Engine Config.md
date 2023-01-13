In the `_config` section of the route, you can specify configuration for the engine using the `engine` property. Example:
```yaml
_config:
  engine:
    ignore:
    - FuryRecharge
    - GaleRecharge
    error:
    - NegativeVar
    warn:
    - GaleOveruse
```

# Global Error Level
`ignore`, `error`, and `warn` can be used to configure the default global error level for individual errors. These will override the default engine error level.

`error` is the highest level. You will see a red banner + it will count toward the total number of errors which you can see in the status bar.

`warn` is the second highest, where an orange banner will show, but it will not count toward the total number of errors in the status bar.

`ignore` is the lowest level. You will see nothing.

The table below shows all engine errors and their respective default error level.
|Error|Description|Default Level|
|-|-|-|
|`FuryOveruse`|When the route uses X furies, but only has at most X-1 uses left.|`error`|
|`GaleOveruse`|When the route uses X gales, but only has at most X-1 uses left.|`error`|
|`FuryUnspecified`|When the route uses `.fury()` function without specifying how many to use|`error`|
|`GaleUnspecified`|When the route uses `.gale()` function without specifying how many to use|`error`|
|`FuryRecharge`|When the route uses fury, but it's possible that the ability hasn't recharged|`warn`|
|`GaleRecharge`|When the route uses gale, but it's possible that the ability hasn't recharged|`warn`|
|`NegativeVar`|When the route specifies a variable change, which results in negative values|`warn`|

Note that you can also suppress individual error instances using `suppress` at a step level. See [Step Customization](./Step%20Customization.md). Step-level suppression will override the `_config` settings.
