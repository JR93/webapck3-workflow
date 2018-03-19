const CONFIG = require('./index');

const eslintConfig = {
  root: true,
  parser: 'babel-eslint',
  parserOptions: {
    'ecmaVersion': 6,
    'sourceType': 'module',
    'ecmaFeatures': {
        'jsx': true
    }
  },
  env: {
    'browser': true,
    'es6': true
  },
  globals: {
    $: true,
    Vue: true,
    __DEV__: true,
    __PROD__: true,
    wx: true,
  },
  extends: CONFIG.react ? ['airbnb-base', 'plugin:react/recommended'] : 'airbnb-base',
  plugins: CONFIG.react ? ['html', 'react'] : ['html'],
  rules: {
    'no-console': 0,
    'func-names': 0,
    'import/no-unresolved': 0,
    'import/extensions': 0,
    'import/no-extraneous-dependencies': 0,
    'linebreak-style': 0,
    'class-methods-use-this': 0
  }
};

const provides = Object.keys(CONFIG.provide);
if (provides.length > 0) {
  provides.forEach((item) => {
    eslintConfig.globals[item] = true;
  });
}

module.exports = eslintConfig;
