const CONFIG = require('../config');

const postcssConfig = {
  plugins: {
    'postcss-cssnext': {
      features: {
        autoprefixer: CONFIG.autoprefixer
      },
      browsers: [
        'ie > 8',
        'ff > 38',
        'safari > 7',
        'chrome > 30',
        'Android >= 2.3',
        'iOS >= 9'
      ],
    }
  }
}

if (CONFIG.px2rem) {
  postcssConfig['plugins'] = Object.assign(postcssConfig['plugins'], {
    'postcss-pxtorem': {
      rootValue: typeof CONFIG.px2rem === 'boolean' ? 75 : +CONFIG.px2rem,
      unitPrecision: 4, // 精确度
      propList: ['*'],
      minPixelValue: 2
    }
  });
}

if (Object.keys(CONFIG.postcss).length > 0) {
  postcssConfig['plugins'] = Object.assign(postcssConfig['plugins'], CONFIG.postcss);
}

module.exports = postcssConfig;
