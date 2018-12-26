/* eslint-disable import/no-dynamic-require */

const findUp = require('find-up')

const configFilePath = findUp.sync('.corianderc')

const configFile = configFilePath ? JSON.parse(require('fs').readFileSync(configFilePath, 'utf8')) : {}

function Coriander({ types: t }) {
  const typesMap = {
    string: t.stringLiteral,
    number: t.numericLiteral,
    boolean: t.booleanLiteral,
  }

  return {
    visitor: {
      ExportDefaultDeclaration(path) {
        const { container, node } = path
        if (node && node.declaration && node.declaration.name && Object.keys(configFile).includes(node.declaration.name)) {
          container.forEach((element, index) => {
            if (t.isExpressionStatement(element)) {
              const hasDefaultProps = t.isIdentifier(
                container[index].expression.left.property,
                { name: 'defaultProps' },
              )
              const defaultProps = hasDefaultProps ? container[index].expression.right.properties : null
              if (hasDefaultProps && defaultProps) {
                Object.entries(configFile[node.declaration.name]).forEach(([key, value]) => {
                  if (Object.keys(typesMap).includes(typeof value) || value === null) {
                    const objectPropertyValue = value === null ? t.nullLiteral() : typesMap[typeof value](value)
                    defaultProps.push(t.objectProperty(t.identifier(key), objectPropertyValue))
                  }
                })
              }
            }
          })
        }
      },
    },
  }
}

module.exports = Coriander
