const treeSitterHast = require('tree-sitter-hast');

treeSitterHast
  .loadLanguagesFromPackage('@atom-languages/language-typescript')
  .then(languages => {
    console.log(Array.from(languages.keys()));
});
