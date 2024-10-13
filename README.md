<h1 align="center">babel-plugin-transform-react-default-props</h1>

<h5 align="center">
Transform React component’s defaultProps
</h5>

### Example .corianderc configuration file

```js
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
          "codes": ['+420', '+421'],
          "Delete": DeleteLogo,
        }
      }
    }]
  ]
```

### License

Dual CC0 and MIT.
