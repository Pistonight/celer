This tutorial discusses how to use Typed String to style/annotate the route doc
# What are Typed Strings
As the name suggests, Typed Strings are strings (text) with type. Celer uses this system to colorize the document. Some typed strings provide additional functionality, like variables, furies/gales, etc.
# Where are Typed Strings
You can use Typed Strings in all visible text areas in the doc except section titles.
```yaml
_route:
- (==) banner # You can use typed string in banners
- Section:
  - Go .dir(E) # typed string as steps (.dir means direction, see below)
  - .loc(Shrine): # can also add : to customize the step (.loc means location)
      notes: .item(Get Item) # typed string in notes
      icon: shrine
      comment: Defeat the .enemy(Guardian) # typed string in comments
```
# Syntax
As you probably already see in the example above, celer uses a function-like system to annotate text with types.

The basic syntax is
```
.FUNCTION(your text)
```
This marks `your text` with `FUNCTION` type. Celer has 13 built-in types and they can be separated into purely semantic types and types with additional functionality

## Semantic Types
These types are purely for semantics and/or styling.
|Type Function|Description|
|-|-|
|item|Show string in item color|
|loc|Show string in location color|
|npc|Show string in npc color|
|rune|Show string in rune color|
|boss|Show string in boss color|
|enemy|Show string in enemy color|
|!!|Show string in important color|
|code|Show string in a monospace font|

## Types with Additional Functionality
#### Direction
The `dir` type can be used to specify direction in either compass format or clock format. 

The clock format must be `XX:XX`. Example: `.dir(12:00)`

While there are many ways to specify compass direction, celer uses `N`, `E`, `W` and `S` to specify the cardinal directions, and uses `<`, `>` and `.` to specify off-cardinal directions. For example, `.dir(N.)` means "A tiny bit right of North" and `.dir(<E)` means "left of East". For ordinals, use `NE`, `NW`, `SE` and `SW`

If the direction is in a compatible format, celer can convert between them automatically. For example, someone who prefers clock directions can choose to see the route doc with clock directions, even if the author originally wrote them in compass directions. **[WIP] This feature is still in development. Currently, the route doc just displays whatever the text is and you cannot convert between clock and compass directions**
#### Hyperlinks
The `link` type turns text into a clickable link. Example: `.link(https://google.com)`. Note that the `https://` is important, otherwise celer will treat it as a relative URL.

You can also specify the text that would show up by putting it inside `[]`, like this
```
.link([Tutorial Here]https://youtube.com/what-ever-your-video-link-is)
```
This will show up as "Tutorial Here" in the doc, and takes the user to the link when they click on it

If your url contains parenthese, i.e `(` or `)`. They need to be escaped because they are tokens for the typed string system. You can surround the whole url with `.(` and `..)`. This is very rare so you usually don't need to worry about it.
```
.link([Weird Link].(https://my-url.com/has-a-(-in-the-link..))
```

#### Variables
Celer has a variable system to keep track of objectives/materials in the doc. You can display them with `.v`
For example, `Korok` is an internal variable contains the number of korok splits you have completed (this is usually how many koroks you have collected). If you write `Check .v(Korok) koroks`, `.v(Korok)` will automatically turn into the number of koroks you have collected at that point.

#### Gale/Fury
`.gale()` and `.fury()` are turned into the usage of gale or fury in that step (e.g. `GALE 1-2` or `FURY 3`). You also need to specify the `gale` and/or `fury` property on that step. For example:
```yaml
.gale() inside naboris:
  gale: 2
```
This will either be `GALE 1-2` or `GALE 2-3` depending on how many gales you have at that point. If you don't have enough gales, the engine will give an error.
