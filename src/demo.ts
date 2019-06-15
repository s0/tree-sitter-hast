import * as Parser from 'tree-sitter';

import {loadLanguagesFromPackage} from './prepare-language';
import {highlightTree} from './highlight';

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

  console.log(JSON.stringify(highlightTree(lang.scopeMappings, text, tree), null, 2));
})();