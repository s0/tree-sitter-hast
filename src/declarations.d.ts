declare module 'tree-sitter-javascript';
declare module 'tree-sitter-css';

declare module 'highlight-tree-sitter' {
  import {Tree} from 'tree-sitter';

  type SymbolicExpression = string | [string, ...any[]];

  function fullSexp(text: string, tree: Tree): SymbolicExpression;

  function highlightSexpFromScopes(sexp: SymbolicExpression, scopes: any): {
    html: string;
    sexp: SymbolicExpression;
    renamedSexp: SymbolicExpression;
  };
}
