export const name = 'Basic Typescript';

export const language = {
  package: '@atom-languages/language-typescript',
  lang: 'typescript'
};

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

/* tslint:disable:quotemark */
export const result = {};
