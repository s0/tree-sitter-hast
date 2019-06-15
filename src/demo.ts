import { partialSexp, fullSexp, _flattenSexp, highlightSexpFromScopes, printSexp } from 'highlight-tree-sitter';
import * as Parser from 'tree-sitter';
import * as Javascript from 'tree-sitter-javascript';
import * as CSON from 'cson';

const JavascriptGrammar = CSON.requireFile(require.resolve('language-javascript/grammars/tree-sitter-javascript.cson'));

const parser = new Parser();
parser.setLanguage(Javascript);

const text = `
function foo() {
  return 1;
}`;
const tree = parser.parse(text);

console.log(`
======================================================================
Parsing text:
======================================================================
${text}
`);

const partial = partialSexp(tree);
console.log(`
======================================================================
Partial Tree:
- only named node types are shown
- (no text)
======================================================================

${printSexp(partial)}
`);

const full = fullSexp(text, tree);
console.log(`
======================================================================
Full Tree:
- _root = top level node to catch extra whitespace
- _anon = unnamed node
- (all text is shown as quoted forms)
======================================================================

${printSexp(full)}
`);

const highlight = highlightSexpFromScopes(full, JavascriptGrammar.scopes);
console.log(JSON.stringify(highlight, null, 2));
console.log(`
======================================================================
Highlighted Tree:
======================================================================

CLASSES APPENDED TO NODE NAMES:
${printSexp(highlight.renamedSexp)}

NODES WITHOUT CLASSES FLATTENED:
${printSexp(highlight.sexp)}
`);

console.log(`
======================================================================
HTML:
======================================================================
${highlight.html}
`);