module.exports = {
  "presets": ["env"],
  "plugins": [
    ["transform-runtime", {
      "helpers": true,
      "polyfill": true,
      "regenerator": true,
      "moduleName": "babel-runtime"
    }],
    "syntax-dynamic-import"
  ]
};
