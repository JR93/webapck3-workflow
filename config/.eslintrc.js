const CONFIG = require('./index');

const eslintConfig = {
  root: true,
  parser: 'babel-eslint',
  parserOptions: {
    sourceType: 'module'
  },
  env: {
    'browser': true
  },
  globals: {
    $: true,
    Vue: true,
    __DEV__: true,
    __PROD__: true,
    wx: true,
  },
  extends: 'airbnb-base',
  plugins: [
    'html'
  ],
  rules: {
    'no-console': 0,
    'func-names': 0,
    'import/no-unresolved': 0,
    'import/extensions': 0,
    'import/no-extraneous-dependencies': 0,
    'linebreak-style': 0
  }
};

const provides = Object.keys(CONFIG.provide);
if (provides.length > 0) {
  provides.forEach((item) => {
    eslintConfig.globals[item] = true;
  });
}

module.exports = eslintConfig;
