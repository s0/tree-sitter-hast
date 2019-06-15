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

## TODO

* Move prepare-language.ts over to highlight-tree-sitter
* Flesh out documentation
* Pull out HAST type definitions into own repo (DefinitelyTyped?)
* Update highlight-tree-sitter to not produce HTML when not needed
