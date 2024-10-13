import { pluginTester } from 'babel-plugin-tester';
import plugin from '../lib/index.js';
import React from 'react';

class HelloClassDeclarationComponent extends React.Component {
  render() {
    return React.createElement('div', null, 'HELLO');
  }
}

function HelloFunctionDeclarationComponent() {
  return React.createElement('div', null, 'HELLO');
}

const HelloArrowFunctionExpressionComponent = () => {
  return React.createElement('div', null, 'HELLO');
};

const HelloVariableDeclarationComponent = function () {
  return React.createElement('div', null, 'HELLO');
};

pluginTester({
  plugin: plugin,
  pluginOptions: {
    "config": {
      "ClassComponentWithoutStaticClassProperty": {
        "propToBeAdded": "addedProp"
      },
      "ClassDeclarationComponentWithStaticClassProperty": {
        "propToBeChanged": "changedProp",
        "propToBeAdded": "addedProp"
      },
      "FunctionDeclarationComponentWithoutDefaultProps": {
        "propToBeAdded": "addedProp"
      },
      "FunctionDeclarationComponentWithDefaultProps": {
        "propToBeChanged": "changedProp",
        "propToBeAdded": "addedProp"
      },
      "ArrowFunctionExpressionComponentWithoutDefaultProps": {
        "propToBeAdded": "addedProp"
      },
      "ArrowFunctionExpressionComponentWithDefaultProps": {
        "propToBeChanged": "changedProp",
        "propToBeAdded": "addedProp"
      },
      "VariableDeclarationComponentWithoutDefaultProps": {
        "propToBeAdded": "addedProp"
      },
      "VariableDeclarationComponentWithDefaultProps": {
        "propToBeChanged": "changedProp",
        "propToBeAdded": "addedProp"
      },
      "HelloClassDeclarationComponentArrowFunctionExpressionComponentWithDefaultProps": {
        "Component": HelloClassDeclarationComponent
      },
      "HelloFunctionDeclarationComponentArrowFunctionExpressionComponentWithDefaultProps": {
        "Component": HelloFunctionDeclarationComponent
      },
      "HelloArrowFunctionExpressionComponentArrowFunctionExpressionComponentWithDefaultProps": {
        "Component": HelloArrowFunctionExpressionComponent
      },
      "HelloVariableDeclarationComponentArrowFunctionExpressionComponentWithDefaultProps": {
        "Component": HelloVariableDeclarationComponent
      }
    }
  },
  babelOptions: {
    parserOpts: {
      plugins: ["jsx"],
    },
  },
  tests: [
    {
      title: "does nothing to unconfigured component",
      code: `
        class UnconfiguredClassComponentWithoutStaticClassProperty extends React.Component {
          render() {
            return <div />;
          }
        }
      `,
      output: `
        class UnconfiguredClassComponentWithoutStaticClassProperty extends React.Component {
          render() {
            return <div />;
          }
        }
      `,
    },
    {
      title: "adds defaultProps to class declaration component",
      code: `
        class ClassComponentWithoutStaticClassProperty extends React.Component {
          render() {
            return <div />;
          }
        }
      `,
      output: `
        class ClassComponentWithoutStaticClassProperty extends React.Component {
          static defaultProps = {
            propToBeAdded: "addedProp",
          };
          render() {
            return <div />;
          }
        }
      `,
    },
    {
      title: "merges defaultProps to class declaration component",
      code: `
        class ClassDeclarationComponentWithStaticClassProperty extends React.Component {
          static defaultProps = {
            propToBeChanged: "propToBeChanged",
            propToRemainUnchanged: "propToRemainUnchanged",
          };
          render() {
            return <div />;
          }
        }
      `,
      output: `
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
      `,
    },
    {
      title: "adds defaultProps to function declaration component",
      code: `
        function FunctionDeclarationComponentWithoutDefaultProps() {
          return <div />;
        }
      `,
      output: `
        function FunctionDeclarationComponentWithoutDefaultProps() {
          return <div />;
        }
        FunctionDeclarationComponentWithoutDefaultProps.defaultProps = {
          propToBeAdded: "addedProp",
        };
      `,
    },
    {
      title: "merges defaultProps to function declaration component",
      code: `
        function FunctionDeclarationComponentWithDefaultProps() {
          return <div />;
        }
        FunctionDeclarationComponentWithDefaultProps.defaultProps = {
          propToBeChanged: "propToBeChanged",
          propToRemainUnchanged: "propToRemainUnchanged",
        };
      `,
      output: `
        function FunctionDeclarationComponentWithDefaultProps() {
          return <div />;
        }
        FunctionDeclarationComponentWithDefaultProps.defaultProps = {
          propToBeChanged: "changedProp",
          propToRemainUnchanged: "propToRemainUnchanged",
          propToBeAdded: "addedProp",
        };
      `,
    },
    {
      title: "adds defaultProps to arrow function declaration component",
      code: `
        const ArrowFunctionExpressionComponentWithoutDefaultProps = () => {
          return <div />;
        };
      `,
      output: `
        const ArrowFunctionExpressionComponentWithoutDefaultProps = () => {
          return <div />;
        };
        ArrowFunctionExpressionComponentWithoutDefaultProps.defaultProps = {
          propToBeAdded: "addedProp",
        };
      `,
    },
    {
      title: "merges defaultProps to arrow function declaration component",
      code: `
        const ArrowFunctionExpressionComponentWithDefaultProps = () => {
          return <div />;
        };
        ArrowFunctionExpressionComponentWithDefaultProps.defaultProps = {
          propToBeChanged: "propToBeChanged",
          propToRemainUnchanged: "propToRemainUnchanged",
        };
      `,
      output: `
        const ArrowFunctionExpressionComponentWithDefaultProps = () => {
          return <div />;
        };
        ArrowFunctionExpressionComponentWithDefaultProps.defaultProps = {
          propToBeChanged: "changedProp",
          propToRemainUnchanged: "propToRemainUnchanged",
          propToBeAdded: "addedProp",
        };
      `,
    },
    {
      title: "adds defaultProps to variable declaration component",
      code: `
        const VariableDeclarationComponentWithoutDefaultProps = function () {
          return <div />;
        };
      `,
      output: `
        const VariableDeclarationComponentWithoutDefaultProps = function () {
          return <div />;
        };
        VariableDeclarationComponentWithoutDefaultProps.defaultProps = {
          propToBeAdded: "addedProp",
        };
      `,
    },
    {
      title: "merges defaultProps to variable declaration component",
      code: `
        const VariableDeclarationComponentWithDefaultProps = function () {
          return <div />;
        };
        VariableDeclarationComponentWithDefaultProps.defaultProps = {
          propToBeChanged: "propToBeChanged",
          propToRemainUnchanged: "propToRemainUnchanged",
        };
      `,
      output: `
        const VariableDeclarationComponentWithDefaultProps = function () {
          return <div />;
        };
        VariableDeclarationComponentWithDefaultProps.defaultProps = {
          propToBeChanged: "changedProp",
          propToRemainUnchanged: "propToRemainUnchanged",
          propToBeAdded: "addedProp",
        };
      `,
    },
    {
      title: "merges defaultProps and injects React class declaration component to arrow function declaration component",
      code: `
        const HelloClassDeclarationComponentArrowFunctionExpressionComponentWithDefaultProps =
          ({ Component }) => {
            return Component;
          };
        HelloClassDeclarationComponentArrowFunctionExpressionComponentWithDefaultProps.defaultProps =
          {
            Component: null,
          };
      `,
      output: `
        function HelloClassDeclarationComponent() {
          _classCallCheck(this, HelloClassDeclarationComponent);
          return _callSuper(this, HelloClassDeclarationComponent, arguments);
        }
        const HelloClassDeclarationComponentArrowFunctionExpressionComponentWithDefaultProps =
          ({ Component }) => {
            return Component;
          };
        HelloClassDeclarationComponentArrowFunctionExpressionComponentWithDefaultProps.defaultProps =
          {
            Component: HelloClassDeclarationComponent,
          };
      `,
    },
    {
      title: "merges defaultProps and injects React function declaration component to arrow function declaration component",
      code: `
        const HelloFunctionDeclarationComponentArrowFunctionExpressionComponentWithDefaultProps =
          ({ Component }) => {
            return Component;
          };
        HelloFunctionDeclarationComponentArrowFunctionExpressionComponentWithDefaultProps.defaultProps =
          {
            Component: null,
          };
      `,
      output: `
        function HelloFunctionDeclarationComponent() {
          return _react[\"default\"].createElement(\"div\", null, \"HELLO\");
        }
        const HelloFunctionDeclarationComponentArrowFunctionExpressionComponentWithDefaultProps =
          ({ Component }) => {
            return Component;
          };
        HelloFunctionDeclarationComponentArrowFunctionExpressionComponentWithDefaultProps.defaultProps =
          {
            Component: HelloFunctionDeclarationComponent,
          };
      `,
    },
    {
      title: "merges defaultProps and injects React arrow function expression component to arrow function declaration component",
      code: `
        const HelloArrowFunctionExpressionComponentArrowFunctionExpressionComponentWithDefaultProps = ({
          Component,
        }) => {
          return Component;
        };
        HelloArrowFunctionExpressionComponentArrowFunctionExpressionComponentWithDefaultProps.defaultProps = {
          Component: null,
        };
      `,
      output: `
        function HelloArrowFunctionExpressionComponent() {
          return _react[\"default\"].createElement(\"div\", null, \"HELLO\");
        }
        const HelloArrowFunctionExpressionComponentArrowFunctionExpressionComponentWithDefaultProps =
          ({ Component }) => {
            return Component;
          };
        HelloArrowFunctionExpressionComponentArrowFunctionExpressionComponentWithDefaultProps.defaultProps =
          {
            Component: HelloArrowFunctionExpressionComponent,
          };
      `,
    },
    {
      title: "merges defaultProps and injects React variable declaration component to arrow function declaration component",
      code: `
        const HelloVariableDeclarationComponentArrowFunctionExpressionComponentWithDefaultProps = ({
          Component,
        }) => {
          return Component;
        };
        HelloVariableDeclarationComponentArrowFunctionExpressionComponentWithDefaultProps.defaultProps = {
          Component: null,
        };
      `,
      output: `
        function HelloVariableDeclarationComponent() {
          return _react["default"].createElement("div", null, "HELLO");
        }
        const HelloVariableDeclarationComponentArrowFunctionExpressionComponentWithDefaultProps =
          ({ Component }) => {
            return Component;
          };
        HelloVariableDeclarationComponentArrowFunctionExpressionComponentWithDefaultProps.defaultProps =
          {
            Component: HelloVariableDeclarationComponent,
          };
      `,
    }
  ]
});
