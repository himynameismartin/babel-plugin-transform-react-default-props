import { types } from '@babel/core';
import * as parser from '@babel/parser';
import type { Scope } from '@babel/traverse';
import type { Config, VisitorState } from '../types'

export const getConfig = ({ state }: { state: VisitorState }): Config => state?.opts?.config || {};

export const isIdentifierDeclared = ({ scope, name }: { scope: Scope, name: string }): boolean => {
  return scope.hasBinding(name);
};

export const parseCodeIntoAst = ({ value }: { value: Function }): types.Statement => {
  const stringifiedValue = value.toString();

  const { name } = value;

  const componentCode = stringifiedValue.startsWith('function(') ? `const ${name} = ${stringifiedValue}` : stringifiedValue;

  try {
    const parsedAst = parser.parse(componentCode, {
      sourceType: 'module',
      plugins: ['jsx', 'classProperties'],
    });

    const astNode = parsedAst.program.body[0];

    return astNode;
  } catch {
    throw new Error('Provided value is not parsable.');
  }
}
