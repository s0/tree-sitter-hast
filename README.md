# tree-sitter-hast

[![Build Status](https://dev.azure.com/samlanning/tree-sitter/_apis/build/status/samlanning.tree-sitter-hast?branchName=master)](https://dev.azure.com/samlanning/tree-sitter/_build/latest?definitionId=2&branchName=master) [![Total alerts](https://img.shields.io/lgtm/alerts/g/samlanning/tree-sitter-hast.svg?logo=lgtm&logoWidth=18)](https://lgtm.com/projects/g/samlanning/tree-sitter-hast/alerts/) [![Language grade: JavaScript](https://img.shields.io/lgtm/grade/javascript/g/samlanning/tree-sitter-hast.svg?logo=lgtm&logoWidth=18)](https://lgtm.com/projects/g/samlanning/tree-sitter-hast/context:javascript) [![](https://img.shields.io/npm/v/tree-sitter-hast.svg)](https://www.npmjs.com/package/tree-sitter-hast)

NPM package to convert [`tree-sitter`](https://tree-sitter.github.io/) parsed syntax trees to syntax-highlighted [`hast`](https://github.com/syntax-tree/hast) (Hypertext Abstract Syntax Trees).

The main reason for this is so that tree-sitter can be used to syntax-highlight code in [`unified`](https://unified.js.org/) projects such as [`remark`](https://github.com/remarkjs/remark) or [`rehype`](https://github.com/rehypejs/rehype). Via plugins such as [`remark-tree-sitter`](https://github.com/samlanning/remark-tree-sitter).

## Installation

```bash
npm install tree-sitter-hast
```

or

```bash
yarn add tree-sitter-hast
```

`tree-sitter-hast` is written in TypeScript and includes type definitions, so there is no need to install a separate `@types/tree-sitter-hast` package if you are using TypeScript.

## Usage

### Scope Mappings

For syntax highlighting,
this package uses the same process that Atom uses with `tree-sitter`.
The HTML classes that are used for syntax-highlighting do not
correspond directly to nodes in the tree produced by tree-sitter,
so scope mappings are used to specify which classes should be
applied to which syntax nodes.
(You can read mode in [Atom's documentation on Creating a Grammar](https://flight-manual.atom.io/hacking-atom/sections/creating-a-grammar/#syntax-highlighting)).

Every Atom package that provides language support using the new `tree-sitter` mechanism
also includes a scope mapping,
and this package provides functionality to directly use these packages for highlighting.

To use an atom language package, like any package you first need to install it using `npm install` or `yarn add`.
Unfortunately most APM packages are not made available on NPM,
so I've started to make some of them available under the NPM organization [`@atom-languages`](https://www.npmjs.com/org/atom-languages).

After installing a language package, you can use `loadLanguagesFromPackage` to prepare them to be used with `tree-sitter-hast`.

#### Example

```bash
npm install tree-sitter-hast @atom-languages/language-typescript
```

[`examples/example-1.js`](examples/example-1.js)
```js
const treeSitterHast = require('tree-sitter-hast');

treeSitterHast
  .loadLanguagesFromPackage('@atom-languages/language-typescript')
  .then(languages => {
    console.log(Array.from(languages.keys()));
});
```

**Output:**
```js
[ 'flow', 'tsx', 'typescript' ]
```

### Highlighting

Highlighting is made available through the following functions:

* `highlightText(language, text)` - highlight some plain text, using a language that's been made available by `loadLanguagesFromPackage`
* `highlightText(parser, scopeMappings, text)` - highlight some plain text, and use a `Parser` that's already been prepared
* `highlightTree(scopeMappings, text, tree)` - highlight a tree that's already been parsed by `tree-sitter`

#### Example

The following 3 examples all produce the same output.

```bash
npm install tree-sitter-hast @atom-languages/language-typescript
```

[`examples/example-2-1.js`](examples/example-2-1.js)
```js
const treeSitterHast = require('tree-sitter-hast');

const text = 'let v = 3';

treeSitterHast
  .loadLanguagesFromPackage('@atom-languages/language-typescript')
  .then(languages => {
    const ts = languages.get('typescript');
    const highlighted = treeSitterHast.highlightText(ts, text);
    console.log(JSON.stringify(highlighted, null, 2));
});
```

[`examples/example-2-2.js`](examples/example-2-2.js)
```js
const Parser = require('tree-sitter');
const treeSitterHast = require('tree-sitter-hast');

const text = 'let v = 3';

treeSitterHast
  .loadLanguagesFromPackage('@atom-languages/language-typescript')
  .then(languages => {
    const ts = languages.get('typescript');
    const parser = new Parser();
    parser.setLanguage(ts.grammar);
    const highlighted = treeSitterHast.highlightText(parser, ts.scopeMappings, text);
    console.log(JSON.stringify(highlighted, null, 2));
});
```

[`examples/example-2-3.js`](examples/example-2-3.js)
```js
const Parser = require('tree-sitter');
const treeSitterHast = require('tree-sitter-hast');

const text = 'let v = 3';

treeSitterHast
  .loadLanguagesFromPackage('@atom-languages/language-typescript')
  .then(languages => {
    const ts = languages.get('typescript');
    const parser = new Parser();
    parser.setLanguage(ts.grammar);
    const tree = parser.parse(text);
    const highlighted = treeSitterHast.highlightTree(ts.scopeMappings, text, tree);
    console.log(JSON.stringify(highlighted, null, 2));
});
```

**Output:**
```json
{
  "type": "element",
  "tagName": "span",
  "properties": {
    "className": [
      "source",
      "ts"
    ]
  },
  "children": [
    {
      "type": "element",
      "tagName": "span",
      "properties": {
        "className": [
          "storage",
          "type"
        ]
      },
      "children": [
        {
          "type": "text",
          "value": "let"
        }
      ]
    },
    {
      "type": "text",
      "value": " v "
    },
    //...
  ]
}
```

### Exporting HTML

From this point, converting the HAST to an HTML can be done in a single call using `hast-util-to-html` (part of `rehype`):

```bash
npm install hast-util-to-html tree-sitter-hast @atom-languages/language-typescript
```

[`examples/example-3.js`](examples/example-3.js)
```js
const toHtml = require('hast-util-to-html');
const Parser = require('tree-sitter');
const treeSitterHast = require('tree-sitter-hast');

const text = 'let v = 3';

treeSitterHast
  .loadLanguagesFromPackage('@atom-languages/language-typescript')
  .then(languages => {
    const ts = languages.get('typescript');
    const parser = new Parser();
    parser.setLanguage(ts.grammar);
    const tree = parser.parse(text);
    const highlighted = treeSitterHast.highlightTree(ts.scopeMappings, text, tree);

    // stringify to HTML
    console.log(toHtml(highlighted));
});
```

**Output:**
```html
<span class="source ts"><span class="storage type">let</span> v <span class="keyword operator js">=</span> <span class="constant numeric">3</span></span>
```

## TODO

* Move prepare-language.ts over to highlight-tree-sitter
* Flesh out documentation
* Pull out HAST type definitions into own repo (DefinitelyTyped?)
* Update highlight-tree-sitter to not produce HTML when not needed
* Move over matches patch to highlight-tree-sitter
