export const name = 'Typescript with Class Whitelist';

export const language = {
  package: '@atom-languages/language-typescript',
  lang: 'typescript'
};

export const classWhitelist = [
  'function', 'variable', 'keyword'
];

export const text = `
class Node {
  value: string;

  constructor(value: string, height: number) {
    this.value = value;
  }

  getValue(): string {
    return this.value;
  }
}
`;

export const result = 'typescript-whitelist.json';
