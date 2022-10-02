To make a route doc with celer, you write the route in text documents in YAML format with celer-specific syntax. Celer will then process the documents and render a nice route doc for you
# YAML
YAML is a language designed to present structured data in a human-readable format. If you are not familiar with YAML, I found [this blog post](http://thomasloven.com/blog/2018/08/YAML-For-Nonprogrammers/) to help

# Sample Route File
Route files are `.celer` files. It's recommended that you open these with a text editor that recognizes YAML format like notepad++, but the windows built-in `notepad` works just fine. Here's an example of `main.celer` (created by the dev tool)

```yaml
_project: 
  name: My Project
  authors: [Your Name]
  version: "1.2.3"
  description: An example project
  url: something.something.else

_route:
- Section 1:
  - Get the sword
  - Get the shield
  - Do some quests
- Section 2:
  - Kill the boss
```
#### Project Section
The `_project` section of `main.celer` defines the metadata of the route doc, such as name, authors, version, etc.
```yaml
_project: 
  name: My Project
  authors: [Your Name]
  version: "1.2.3"
  description: An example project
  url: something.something.else
```
Currently, only `name` is visible in the website. However, the full metadata will be accessible from the website in the future, so you can view the version, authors, etc.

#### Route Section
The `_route` section defines the route itself. We will go in depth about what you can do in this section in another tutorial.

#### Config Section
The `_config` section defines some custom properties for the route doc.

An example is below
```yaml
_config:
  split-format:
    Shrine: "{{%03 Shrine}} {{_}}"
    Korok: "{{Korok}} {{_}}"
```

And here's a table of all available configs and the specs (currently only one, but more to come)
|Config|Description|
|-|-|
|`split-format`|Customize split format for individual split types. Details see [here](../WebApp/Customize%20Split%20Format%20and%20Export%20Splits.md)
