import * as Parser from 'tree-sitter';
import { Tree } from 'tree-sitter';
import { Element, Text } from './hast';

import { SymbolicExpression, fullSexp, highlightSexpFromScopes } from 'highlight-tree-sitter';

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
      return {
        type: 'element',
        tagName: 'span',
        properties: {
          className
        },
        children
      };
    },
    value => ({type: 'text', value}));
}

export function highlightText(parser: Parser, scopeMappings: any, text: string) {
  const tree = parser.parse(text);
  return highlightTree(scopeMappings, text, tree);
}
