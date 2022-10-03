
This documentation covers the schema of the celer route object and must be up-to-date with the code
# Route Object as JSON
The entire route is stored in a JSON object. At the highest level, the object has 3 properties: `_project`, `_config` and `_route`. `_config` is optional while the other 2 are required.

## `_project`
The `_project` property is an object that defines the metadata of the route. It has 5 required attributes:
|Attribute|Description|
|-|-|
|name| Name of the route/category|
|description|Description of the route|
|version|Version of the route. Typically in `x.x.x` format but can be any string|
|url|A custom url you can specify. This is currently unused, but you can use it to link to the repo, etc|
|authors| An array containing the authors|

## `_config`
The `_config` property defines customizations that apply to the whole doc. All of the configs are optional
#### `split-format`

*TODO*
