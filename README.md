<h1 align="center">babel-plugin-transform-react-default-props</h1>

<h5 align="center">
Transform React component’s defaultProps
</h5>

### Quickstart

```console
yarn
yarn build
```

**babel.config.js**
```js
const React = require('react');

const DeleteLogo = () => {
  return React.createElement('div', null, '✕');
};


module.exports = function () {
  return {
    "plugins": [
      ["./lib/index.js", {
        "config": {
          "Icon": {
            "width": 32,
            "height": 32,
            "color": "#dcdcdc"
          },
          "Input": {
            "fontSize": 16,
            "codes": ["+420", "+421"],
            "Delete": DeleteLogo
          }
        }
      }]
    ]
  }
};
```

### Motivation

`babel-plugin-transform-react-default-props` is an easy and convenient way of overriding component's default props with your own without the need to re-export it.

And it's a build-time transformation so it should save some bytes and nanoseconds (in theory 😅) when compared to run-time alternatives.

### Example

#### Input

```js
class ClassDeclarationComponentWithStaticClassProperty extends React.Component {
  static defaultProps = {
    propToBeChanged: "propToBeChanged",
    propToRemainUnchanged: "propToRemainUnchanged",
  };
  render() {
    return <div />;
  }
}
```

#### Babel Plugins Config

```js
  "plugins": [
    ["../lib/index.js", {
      "config": {
        "ClassDeclarationComponentWithStaticClassProperty": {
          "propToBeChanged": "changedProp",
          "propToBeAdded": "addedProp"
        }
      }
    }]
  ]
```

#### Output

```js
class ClassDeclarationComponentWithStaticClassProperty extends React.Component {
  static defaultProps = {
    propToBeChanged: "changedProp",
    propToRemainUnchanged: "propToRemainUnchanged",
    propToBeAdded: "addedProp",
  };
  render() {
    return <div />;
  }
}
```

### TODO

`defaultProps` are deprecated for functional components and this plugin should transform default function parameters as well.

### License

Dual CC0 and MIT.
