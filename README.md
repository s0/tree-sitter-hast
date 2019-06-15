# tree-sitter-hast

[![](https://img.shields.io/npm/v/tree-sitter-hast.svg)](https://www.npmjs.com/package/tree-sitter-hast)

NPM package to convert [`tree-sitter`](https://tree-sitter.github.io/) parsed syntax trees to syntax-highlighted [`hast`](https://github.com/syntax-tree/hast) (Hypertext Abstract Syntax Trees).

The main reason for this is so that tree-sitter can be used to syntax-highlight code in [`unified`](https://unified.js.org/) projects such as [`remark`](https://github.com/remarkjs/remark) or [`rehype`](https://github.com/rehypejs/rehype). Via plugins such as [`remark-tree-sitter`](https://github.com/samlanning/remark-tree-sitter).

## TODO

* Move prepare-language.ts over to highlight-tree-sitter
* Clean up examples and move out of package
* Add tests
* Flesh out documentation
* Add LGTM and Azure
* Pull out HAST type definitions into own repo (DefinitelyTyped?)
