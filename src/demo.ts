import { fullSexp, _flattenSexp, highlightSexpFromScopes, printSexp } from 'highlight-tree-sitter';
import * as Parser from 'tree-sitter';

import {loadLanguagesFromPackage} from './prepare-language';

(async () => {
  const langs = await loadLanguagesFromPackage('@atom-languages/language-typescript');

  const lang = langs.get('typescript');
  if (!lang) return;

  const parser = new Parser();
  parser.setLanguage(lang.grammar);

  const text = `
  function foo() {
    return 1;
  }`;
  const tree = parser.parse(text);


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

  const highlight = highlightSexpFromScopes(full, lang.scopeMappings);
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
})();