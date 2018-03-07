const path = require('path');

module.exports = {
  // 外部全局依赖声明
  globals: {},
  // 与globals配合使用，免import/require声明
  provide: {},
  // 使用ESLint
  eslint: true,
  // 资源文件名加hash
  hash: true,
  // 自动加浏览器前缀
  autoprefixer: true,
  // 是否使用rem
  px2rem: true,
  // 打开浏览器
  open: true,
  // 使用vue
  vue: true,
  // 使用雪碧图
  sprite: false,
  // 指定本地服务端口号，默认8899
  port: 7845,
  // postcss插件
  postcss: {
    /* example plugin */
    // 'postcss-pxtorem': {
    //   rootValue: 64
    // }
  },
  // 开发环境设置
  dev: {
    // cdn
    publicPath: '/',
    // dest
    outputPath: path.resolve(__dirname, '../dev')
  },
  // 测试环境设置
  test: {
    // cdn
    publicPath: '/',
    // dest
    outputPath: path.resolve(__dirname, '../test')
  },
  // 生产环境设置
  prod: {
    // cdn
    publicPath: '/',
    // dest
    outputPath: path.resolve(__dirname, '../output')
  },
};
