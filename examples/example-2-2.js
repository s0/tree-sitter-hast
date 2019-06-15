const Parser = require('tree-sitter');
const treeSitterHast = require('tree-sitter-hast');

const text = 'let v = 3';

treeSitterHast
  .loadLanguagesFromPackage('@atom-languages/language-typescript')
  .then(languages => {
    const ts = languages.get('typescript');
    const parser = new Parser();
    parser.setLanguage(ts.grammar);
    const highlighted = treeSitterHast.highlightText(parser, ts.scopeMappings, text);
    console.log(JSON.stringify(highlighted, null, 2));
});
