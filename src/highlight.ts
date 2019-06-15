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

export function highlightTree(scopeMappings: any, text: string, tree: Tree): Element | Text {
  const full = fullSexp(text, tree);
  const highlight = highlightSexpFromScopes(full, scopeMappings);
  return convertSexp<Element | Text>(
    highlight.sexp,
    (name, children) => {
      const className = name.split('.').slice(1);
      const hast: Element = {
        type: 'element',
        tagName: 'span',
        children
      };
      if (className.length > 0) hast.properties = { className };
      return hast;
    },
    value => ({type: 'text', value}));
}

function isParser(p: PreparedLanguage | Parser): p is Parser {
  return !!(p as Parser).parse;
}

/**
 * Highlight the given text and return the HAST
 *
 * @param language a PreparedLanguage returned by loadLanguagesFromPackage()
 * @param text the plaintext to highlight
 */
export function highlightText(language: PreparedLanguage, text: string): Element | Text;
/**
 * Highlight the given text and return the HAST
 *
 * @param parser an active Parser with the language already set
 * @param scopeMappings the atom scope mappings for the language used in the given parser
 * @param text the plaintext to highlight
 */
export function highlightText(parser: Parser, scopeMappings: any, text: string): Element | Text;

export function highlightText(arg1: PreparedLanguage | Parser, arg2: any, arg3?: string) {

  // Extract arguments
  const {parser, scopeMappings, text} = (() => {
    if (isParser(arg1)) {
      if (arg3)
        return {parser: arg1, scopeMappings: arg2, text: arg3};
    } else if (arg1.grammar && arg1.scopeMappings && typeof arg2 === 'string') {
      const parser = new Parser();
      parser.setLanguage(arg1.grammar);
      return {parser, scopeMappings: arg1.scopeMappings, text: arg2};
    }
    throw new Error('Invalid arguments to highlightText()');
  })();

  const tree = parser.parse(text);
  return highlightTree(scopeMappings, text, tree);
}
