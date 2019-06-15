import * as assert from 'assert';
import * as Parser from 'tree-sitter';

import * as d001 from '../data/001';

import {loadLanguagesFromPackage, highlightTree} from 'tree-sitter-hast';

const TEST_CASES = [d001];

describe('main tests', () => {
  for (const testCase of TEST_CASES) {
    it(testCase.name, async () => {
      const langs = await loadLanguagesFromPackage(testCase.language.package);

      const lang = langs.get(testCase.language.lang);
      if (!lang) throw new Error('Invalid Language');

      const parser = new Parser();
      parser.setLanguage(lang.grammar);

      const tree = parser.parse(testCase.text);
      const highlighted = highlightTree(lang.scopeMappings, testCase.text, tree);

      try {
        assert.deepEqual(testCase.result, highlighted);
      } catch (e) {
        // Uncomment to print out actual result
        console.log(JSON.stringify(highlighted, null, 2));
        throw e;
      }
    });
  }
});
