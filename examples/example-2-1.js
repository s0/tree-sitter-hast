const treeSitterHast = require('tree-sitter-hast');

const text = 'let v = 3';

treeSitterHast
  .loadLanguagesFromPackage('@atom-languages/language-typescript')
  .then(languages => {
    const ts = languages.get('typescript');
    const highlighted = treeSitterHast.highlightText(ts, text);
    console.log(JSON.stringify(highlighted, null, 2));
});
