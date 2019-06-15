const toHtml = require('hast-util-to-html');
const Parser = require('tree-sitter');
const treeSitterHast = require('tree-sitter-hast');

const text = 'let v = 3';

treeSitterHast
  .loadLanguagesFromPackage('@atom-languages/language-typescript')
  .then(languages => {
    const ts = languages.get('typescript');
    const highlighted = treeSitterHast.highlightText(ts, text, {classWhitelist: ['storage', 'numeric']});

    // stringify to HTML
    console.log(toHtml(highlighted));
});