export const name = 'Start And End Whitespace';

export const language = {
  package: '@atom-languages/language-typescript',
  lang: 'typescript'
};

/* tslint:disable:no-trailing-whitespace */
export const text = `

  

foo()
    

`;
/* tslint:enable:no-trailing-whitespace */

/* tslint:disable:quotemark */
export const result = {};
