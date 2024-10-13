import { types, PluginObj } from '@babel/core';
import type { NodePath } from '@babel/traverse';

import type { ReactLeaf, Props, Config, VisitorState } from './types'
import { getConfig, isIdentifierDeclared, parseCodeIntoAst } from './utils'

export default ({ types: t }: { types: typeof types }): PluginObj => {
  const insertCodeIntoAstAndReturnIdentifier = ({ value, visitorPath }: { value: ReactLeaf, visitorPath: NodePath }): types.Identifier | types.Expression => {
    if (t.isNode(value)) {
      if (t.isExpression(value)) {
        return value;
      } else {
        throw new Error('Provided value is not an expression.');
      }
    }
  
    if (typeof value === 'function') {
      const componentAst = parseCodeIntoAst({ value });

      const { scope } = visitorPath;
      const { name } = value;

      if (!isIdentifierDeclared({ scope, name })) {
        let nodeToBeInserted = null;
        
        if (t.isFunctionDeclaration(componentAst) || t.isClassDeclaration(componentAst)) {
          nodeToBeInserted = componentAst;
        } else if (t.isExpressionStatement(componentAst)) {
          nodeToBeInserted = t.variableDeclaration('const', [
            t.variableDeclarator(t.identifier(name), componentAst.expression)
          ]);
        } else if (t.isVariableDeclaration(componentAst)) {
          nodeToBeInserted = componentAst;
        }

        if (nodeToBeInserted && visitorPath.parentPath) {
          const parentPath = visitorPath.parentPath as NodePath<types.Node>;

          if (parentPath.node) {
            if (t.isProgram(parentPath.node)) {
              visitorPath.insertBefore(nodeToBeInserted);
            } else if (t.isBlockStatement(parentPath.node)) {
              parentPath.insertBefore(nodeToBeInserted);
            }
          }
        }
      } else {
        console.log(`Skipping "${name}" as it is already declared in this scope.`);
      }
      return t.identifier(name);
    }

    return t.valueToNode(value);
  }


  const mapPropsToObjectProperties = ({ props, visitorPath }: { props: Props, visitorPath: NodePath }): types.ObjectProperty[] => {
    return Object.keys(props).map((key) => {
      return t.objectProperty(t.identifier(key), insertCodeIntoAstAndReturnIdentifier({ value: props[key], visitorPath }))
    });
  }

  const modifyExistingDefaultProps = (
    { value, props, visitorPath }: { value: types.Expression | null, props: Props, visitorPath: NodePath }
  ) => {
    if (t.isObjectExpression(value)) {
      const existingProps: Record<string, ReactLeaf> = value.properties.reduce((existingProps, prop) => {
        if (
          t.isObjectProperty(prop) &&
          t.isIdentifier(prop.key) &&
          (types.isStringLiteral(prop.value) || types.isNumericLiteral(prop.value) || types.isBooleanLiteral(prop.value))
        ) {
          existingProps[prop.key.name] = prop.value.value;
        }

        return existingProps;
      }, {} as Record<string, ReactLeaf>);
  
      const mergedProps = { ...existingProps, ...props };
      value.properties = mapPropsToObjectProperties({ props: mergedProps, visitorPath });
    }
  }

  const buildDefaultPropsObjectExpression = ({ props, visitorPath }: { props: Props, visitorPath: NodePath }): types.ObjectExpression => {
    return t.objectExpression(
      mapPropsToObjectProperties({ props, visitorPath })
    );
  }

  const handleFunctionComponent = ({ path, componentName, config }: {
    path: NodePath<types.FunctionDeclaration | types.FunctionExpression | types.ArrowFunctionExpression | types.VariableDeclaration>,
    componentName: string,
    config: Config,
  }) => {
    let hasDefaultProps = false;
    const programPath = path.findParent((parentPath: NodePath) =>
      parentPath.isProgram()
    )
    
    if (programPath) {
      programPath.traverse({
        AssignmentExpression(assignmentPath: NodePath<types.AssignmentExpression>) {
          const isDefaultProps =
            t.isMemberExpression(assignmentPath.node.left) &&
            t.isIdentifier(assignmentPath.node.left.object) &&
            assignmentPath.node.left.object.name === componentName &&
            t.isIdentifier(assignmentPath.node.left.property) &&
            assignmentPath.node.left.property.name === 'defaultProps'

          if (isDefaultProps) {
            hasDefaultProps = true;
            modifyExistingDefaultProps({ value: assignmentPath.node.right, props: config[componentName], visitorPath: path })
            assignmentPath.stop();
          }
        }
      });
    };

    if (!hasDefaultProps) {
      const newProps = config[componentName];
      if (!newProps) return;
  
      path.insertAfter(
        t.expressionStatement(
          t.assignmentExpression(
            '=',
            t.memberExpression(t.identifier(componentName), t.identifier('defaultProps')),
            buildDefaultPropsObjectExpression({ props: newProps, visitorPath: path })
          )
        )
      );
    }
  }

  return {
    visitor: {
      ClassDeclaration(path: NodePath<types.ClassDeclaration>, state: VisitorState) {
        const config = getConfig({ state });
        const componentName = path?.node?.id?.name;

        if (componentName && config[componentName]) {
          let hasStaticDefaultProps = false;

          path.node.body.body.forEach((node) => {
            if (
              t.isClassProperty(node) &&
              t.isIdentifier(node.key) &&
              node.key.name === 'defaultProps' &&
              node.value !== undefined
            ) {
              hasStaticDefaultProps = true;
              modifyExistingDefaultProps({ value: node.value, props: config[componentName], visitorPath: path })
            }
          });

          if (!hasStaticDefaultProps) {
            const defaultPropsNode = t.classProperty(
              t.identifier('defaultProps'),
              buildDefaultPropsObjectExpression({ props: config[componentName], visitorPath: path })
            );
            defaultPropsNode.static = true;

            path.get('body').unshiftContainer('body', defaultPropsNode);
          }
        }
      },

      FunctionDeclaration(path: NodePath<types.FunctionDeclaration>, state: VisitorState) {
        const config = getConfig({ state });
        const componentName = path?.node?.id?.name;

        if (componentName && config[componentName]) {
          handleFunctionComponent({
            path,
            componentName,
            config
          });
        }
      },

      ArrowFunctionExpression(path: NodePath<types.ArrowFunctionExpression>, state: VisitorState) {
        const config = getConfig({ state });
        if (path.parent.type === 'VariableDeclarator' && t.isIdentifier(path.parent.id)) {
          const componentName = path.parent.id.name;

          if (config[componentName]) {
            handleFunctionComponent({
              path,
              componentName,
              config
            });
          }
        }
      },

      VariableDeclaration(path: NodePath<types.VariableDeclaration>, state: VisitorState) {
        const config = getConfig({ state });

        path.node.declarations.forEach((declaration: types.VariableDeclarator) => {
          if (t.isVariableDeclarator(declaration) && t.isIdentifier(declaration.id)) {
            const componentName = declaration.id.name;

            if (
              config[componentName] &&
              (t.isFunctionExpression(declaration.init) || t.isArrowFunctionExpression(declaration.init))
            ) {
              handleFunctionComponent({
                path,
                componentName,
                config
              });
            }
          }
        });
      }
    }
  };
};
