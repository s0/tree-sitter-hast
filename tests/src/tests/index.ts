import * as assert from 'assert';
import * as fs from 'fs';
import * as path from 'path';
import * as Parser from 'tree-sitter';
import {promisify} from 'util';

import {loadLanguagesFromPackage, highlightTree} from 'tree-sitter-hast';

import * as basicTypescript from '../data/basic-typescript';
import * as typescript from '../data/typescript';
import * as whitespace from '../data/whitespace';

const readFile = promisify(fs.readFile);
const writeFile = promisify(fs.writeFile);

const DATA_DIR = path.join(path.dirname(path.dirname(__dirname)), 'src', 'data');
const TEST_CASES = [
  basicTypescript,
  typescript,
  whitespace
];

describe('main tests', () => {
  for (const testCase of TEST_CASES) {
    it(testCase.name, async () => {
      const langs = await loadLanguagesFromPackage(testCase.language.package);

      const lang = langs.get(testCase.language.lang);
      if (!lang) throw new Error(`Invalid Language ${testCase.language.lang}, available languages are: ${Array.from(langs.keys())}`);

      const parser = new Parser();
      parser.setLanguage(lang.grammar);

      const tree = parser.parse(testCase.text);
      const highlighted = highlightTree(lang.scopeMappings, testCase.text, tree);

      // Load expected result
      const jsonPath = path.join(DATA_DIR, testCase.result);
      const json = await readFile(jsonPath, 'utf8');
      const expected = JSON.parse(json);

      try {
        assert.deepEqual(highlighted, expected);
      } catch (e) {
        if (process.env.TEST_FIX === 'true') {
          const newJson = JSON.stringify(highlighted, null, 2);
          await writeFile(jsonPath, newJson);
          throw new Error(`Result Unexpected, written new contents to ${jsonPath}`);
        } else {
          throw e;
        }
      }
    });
  }
});
