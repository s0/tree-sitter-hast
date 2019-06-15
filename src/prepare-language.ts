import {promisify} from 'util';
import * as sass from 'node-sass';

import * as Parser from 'tree-sitter';
import * as css from 'tree-sitter-css';
import { createSecureServer } from 'http2';

type ScopeMappings = {[selector: string]: string};

export interface PreparedLanguage {
  /**
   * The tree-sitter grammar
   */
  grammar: any;
  /**
   * Mapping from css selectors to classes,
   * describing which classes should be applied to which syntax nodes.
   *
   * e.g: {"class > identifier": "entity.name.type.class"}
   *
   * @see https://flight-manual.atom.io/hacking-atom/sections/creating-a-grammar/#syntax-highlighting
   */
  scopeMappings?: ScopeMappings;
}

/**
 * Load the grammar and scope mappings from an NPM package like "tree-sitter-javascript"
 * @param packageName
 */
export async function loadLanguageFromPackage(packageName: string): Promise<PreparedLanguage> {
  const lang: PreparedLanguage = {
    grammar: null
  };

  lang.grammar = require(packageName);

  // Try and load the scope mappings
  const mappingPath = require.resolve(`${packageName}/properties/highlights.css`);
  const parsedSASS = await promisify(sass.render)({
    file: mappingPath
  });

  // Parce css with tree-sitter ¯\_(ツ)_/¯
  const cssParser = new Parser();
  cssParser.setLanguage(css);
  cssParser.parse(parsedSASS.css.toString());
  const parsedCSS = cssParser.parse(parsedSASS.css.toString());
  lang.scopeMappings = treeSitterCSSToMap(parsedCSS);

  return lang;
}

function treeSitterCSSToMap(tree: Parser.Tree): ScopeMappings {
  const map: ScopeMappings = {};
  const cursor = tree.walk();

  const node = () => cursor.currentNode;

  if (node().type === 'stylesheet') {
    cursor.gotoFirstChild();
    while (true) {
      if (node().type === 'rule_set') {
        // Extract selectors
        const selectors: string[] = [];
        cursor.gotoFirstChild();
        if (cursor.gotoFirstChild()) {
          while (true) {
            if (node().type !== '') {
              console.log(node().type, node().text);
            }
            if (!cursor.gotoNextSibling()) break;
          }
          cursor.gotoParent();
        }
        cursor.gotoNextSibling();

        console.log(node());
        cursor.gotoParent();
      }
      if (!cursor.gotoNextSibling()) break;
    }
  }

  return map;
}
