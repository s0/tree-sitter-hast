import * as Parser from 'tree-sitter';
import { Tree } from 'tree-sitter';
import { Element, Text } from './hast';

import { SymbolicExpression, fullSexp, highlightSexpFromScopes } from 'highlight-tree-sitter';

import { PreparedLanguage } from './prepare-language';

/**
 * Generic function to transform an s-expression to something else
 */
function convertSexp<T>(
  sexp: SymbolicExpression,
  convertElement: (name: string, children: T[]) => T,
  convertText: (text: string) => T) {
  function print(node: SymbolicExpression): T {
    if (typeof node === 'string') return convertText(node);
    const [name, ...children] = node;
    return convertElement(name, children.map(print));
  }
  return print(sexp);
}

export interface HighlightingOptions {
  /**
   * If specified, only the classes in the given whitelist will be used and output.
   *
   * Use this to reduce the output when only certain classes are styled.
   */
  classWhitelist?: string[];
}

export function highlightTree(
    scopeMappings: any,
    text: string,
    tree: Tree,
    options?: HighlightingOptions): Element | Text {
  const classWhitelist = options ? options.classWhitelist : null;
  const full = fullSexp(text, tree);
  const highlight = highlightSexpFromScopes(full, scopeMappings);
  const sexp = convertSexp<(Element | Text)[]>(
    highlight.sexp,
    (name, children) => {
      const flattenedChildren = ([] as (Element | Text)[]).concat(...children);
      const className = name.split('.').slice(1)
        // Only include classes if there is no whitelist, or the class is in the whitelist
        .filter(name => !classWhitelist || classWhitelist.indexOf(name) !== -1);
      // Collapse if no classes will be applied
      if (className.length === 0) return flattenedChildren;
      return [{
        type: 'element',
        tagName: 'span',
        properties: {
          className
        },
        children: flattenedChildren
      }];
    },
    value => [{type: 'text', value}]);
  if (sexp.length === 1)
    return sexp[0];
  return {
    type: 'element',
    tagName: 'span',
    children: sexp
  };
}

function isParser(p: PreparedLanguage | Parser): p is Parser {
  return !!(p as Parser).parse;
}

/**
 * Highlight the given text and return the HAST
 *
 * @param language a PreparedLanguage returned by loadLanguagesFromPackage()
 * @param text the plaintext to highlight
 * @param options optional options for highlighting
 */
export function highlightText(language: PreparedLanguage, text: string, options?: HighlightingOptions): Element | Text;
/**
 * Highlight the given text and return the HAST
 *
 * @param parser an active Parser with the language already set
 * @param scopeMappings the atom scope mappings for the language used in the given parser
 * @param text the plaintext to highlight
 * @param options optional options for highlighting
 */
export function highlightText(parser: Parser, scopeMappings: any, text: string, options?: HighlightingOptions): Element | Text;

export function highlightText(arg1: PreparedLanguage | Parser, arg2: any, arg3?: string | HighlightingOptions, arg4?: HighlightingOptions) {

  // Extract arguments
  const {parser, scopeMappings, text, options} = (() => {
    if (isParser(arg1)) {
      if (typeof arg3 === 'string')
        return {parser: arg1, scopeMappings: arg2, text: arg3, options: arg4};
    } else if (arg1.grammar && arg1.scopeMappings && typeof arg2 === 'string') {
      const parser = new Parser();
      parser.setLanguage(arg1.grammar);
      const options = typeof arg3 === 'string' ? undefined : arg3;
      return {parser, scopeMappings: arg1.scopeMappings, text: arg2, options};
    }
    throw new Error('Invalid arguments to highlightText()');
  })();

  const tree = parser.parse(text);
  return highlightTree(scopeMappings, text, tree, options);
}
