This documentation is for the grammar and implementation of the Typed String System

# Grammar
The grammar of the system is:
```
TypedString => Header Text
Header => StepDescriber BannerDescriber
StepDescriber => + | epsilon
BannerDescriber => (==) | (!=) | (?=) | (^=) | (^?) | (^!) | epsilon
Text => NormalText Text*
Text => FunctionText Text*
Text* => NormalText Text* | epsilon
Text* => FunctionText Text* | epsilon
FunctionText = . <identifier> ( Text* )
NormalText => <identifier>
EscapedText => .( Text* ..)
```

# Header
The header is separated first from the rest before processing. The parser will look for `+` and the banner describers, set the flags if they are present, and send the rest of the text for tokenization.

The header is only used for step texts, not notes or comments. If the header is present in notes or comments, they are simply discarded

# Tokenize & Parse
The text after the header is first tokenized. The tokenizer simply looks for `.`, `(` and `)` and separate the string into tokens.

For example, `.item(some item)` will be tokenized into `[".", "item", "(", "some item", ")"]. See https://github.com/iTNTPiston/celer/blob/main/packages/celer-web-app/src/core/compiler/text/StringParser.ts

# TypedString object
See https://github.com/iTNTPiston/celer/blob/main/packages/celer-web-app/src/core/compiler/text/TypedString.ts