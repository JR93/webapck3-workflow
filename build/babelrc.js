const CONFIG = require('../config');

const babelRC = {
  "presets": [["env", {
    "modules": false
  }]],
  "plugins": [
    "transform-runtime",
    "syntax-dynamic-import"
  ]
};

if (CONFIG.react) {
  babelRC["presets"].push("react");
}

module.exports = babelRC;
