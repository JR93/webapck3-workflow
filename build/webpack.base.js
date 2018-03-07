const path = require('path');
const glob = require('glob');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPljugin = require('copy-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const OpenBrowserPlugin = require('open-browser-webpack-plugin');
const SpritesmithPlugin = require('webpack-spritesmith');

const babelConfig = require('./babelrc.js');
const cssMinimizeConfig = require('./cssmin.js');
const CONFIG = require('../config');
const env = process.env.NODE_ENV === 'development' ? 'dev' : 'prod';
const isNeedHash = !!(CONFIG.hash && env === 'prod');

const entries = {};
glob.sync(path.join(__dirname, '../src/*.js')).forEach((filePath) => {
  const filename = path.basename(filePath, '.js');
  entries[filename] = `./src/${filename}.js`;
});

const externalVue = CONFIG.vue ? { vue: 'Vue' } : {};
const provideVue = CONFIG.vue ? { Vue: 'vue' } : {};
const copyOutputPath = env === 'dev' ? path.join(CONFIG.dev.outputPath, '/static') : path.join(CONFIG.prod.outputPath, '/static');
const publicPath = env === 'dev' ? CONFIG.dev.publicPath : CONFIG.prod.publicPath;
const outputFilename = `js/[name]${isNeedHash ? '.[chunkhash:7]' : ''}.js`;

const vueScssConfig = env === 'dev'
  ? 'vue-style-loader!css-loader?sourceMap!sass-loader?sourceMap'
  : ExtractTextPlugin.extract({
    fallback: 'vue-style-loader',
    use: [
      {
        loader: 'css-loader',
        options: {
          minimize: cssMinimizeConfig
        }
      },
      'sass-loader'
    ]
  });

const vueCssConfig = env === 'dev'
  ? 'vue-style-loader!css-loader?sourceMap'
  : ExtractTextPlugin.extract({
    fallback: 'vue-style-loader',
    use: [
      {
        loader: 'css-loader',
        options: {
          minimize: cssMinimizeConfig
        }
      }
    ]
  });

const baseConfig = {
  context: path.resolve(__dirname, '../'),
  devtool: env === 'dev' ? '#cheap-eval-source-map' : false,
  cache: true,
  entry: entries,
  output: {
    path: env === 'dev' ? CONFIG.dev.outputPath : CONFIG.prod.outputPath,
    filename: outputFilename,
    chunkFilename: outputFilename,
    publicPath: publicPath
  },
  module: {
    noParse: [/static/, /common\/lib/],
    rules: [
      {
        test: /\.vue$/,
        loader: 'vue-loader',
        options: {
          loaders: {
            js: `babel-loader?${JSON.stringify(babelConfig)}`,
            scss: vueScssConfig,
            css: vueCssConfig
          },
          postcss: {
            sourceMap: env === 'dev',
            config: {
              path: path.resolve(__dirname, 'postcss.config.js')
            }
          }
        },
        exclude: /node_modules/
      },
      {
        test: /\.js$/,
        loader: 'babel-loader',
        options: {
          ...babelConfig
        },
        exclude: /node_modules/
      },
      {
        test: /\.(ttf|otf|eot|woff2?)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          context: path.join(__dirname, '../src/'),
          name: `[path][name]${isNeedHash ? '.[hash:7]': ''}.[ext]`,
          fallback: 'file-loader'
        },
      },
      {
        test: /base64.*\.(png|jpe?g|gif|svg)(\?.*)?$/i,
        use: env === 'dev' ? ['url-loader'] : ['url-loader', 'image-webpack-loader']
      },
      {
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/i,
        exclude: /base64/,
        use: env === 'dev' ? [
          `file-loader?context=${path.join(__dirname, '../src/')}&name=[path][name]${isNeedHash ? '.[hash:7]': ''}.[ext]`
        ] : [
          `file-loader?context=${path.join(__dirname, '../src/')}&name=[path][name]${isNeedHash ? '.[hash:7]': ''}.[ext]`,
          'image-webpack-loader'
        ]
      },
      {
        test: /\.hbs$/,
        loader: 'assemble-webpack-loader',
        options: {
          layouts: path.resolve(__dirname, '../src/html/layouts/**/*.hbs'),
          partials: path.resolve(__dirname, '../src/html/partials/**/*.hbs'),
          define: {
            __DEV__: env === 'dev',
            __VUE__: CONFIG.vue,
            __REM__: CONFIG.px2rem
          }
        }
      }
    ]
  },
  plugins: [
    new CopyWebpackPljugin([
      {
        from: path.resolve(__dirname, '../src/static'),
        to: copyOutputPath
      }
    ]),
    new webpack.ProvidePlugin({
      $: 'jquery',
      ...provideVue,
      ...CONFIG.provide
    }),
  ],
  resolve: {
    alias: {
      'src': path.resolve(__dirname, '../src'),
      'html': path.resolve(__dirname, '../src/html'),
      'css': path.resolve(__dirname, '../src/css'),
      'img': path.resolve(__dirname, '../src/img'),
      'font': path.resolve(__dirname, '../src/font'),
      'common': path.resolve(__dirname, '../src/common'),
      'component': path.resolve(__dirname, '../src/component'),
    },
    extensions: ['.js', '.vue'],
    modules: CONFIG.sprite ? ['node_modules', 'spritesmith-generated'] : ['node_modules']
  },
  externals: {
    jquery: 'jQuery',
    ...externalVue,
    ...CONFIG.globals
  }
};

if (CONFIG.eslint) {
  baseConfig.module.rules.unshift({
    test: /\.(js|vue)$/,
    loader: 'eslint-loader',
    include: path.resolve(__dirname, '../src'),
    options: {
      configFile: path.resolve(__dirname, '../config/.eslintrc.js'),
      failOnError: env !== 'dev',
      formatter: require('eslint-friendly-formatter')
    },
    enforce: 'pre'
  });
}

if (CONFIG.sprite) {
  baseConfig.plugins.push(new SpritesmithPlugin({
    src: {
      cwd: path.resolve(__dirname, '../src/img/slice'),
      glob: '*.png'
    },
    target: {
      image: path.resolve(__dirname, '../src/img/sprite/sprite.png'),
      css: path.resolve(__dirname, '../src/css/sprite/sprite.scss')
    },
    apiOptions: {
      cssImageRef: '~img/sprite/sprite.png'
    }
  }));
}

const htmlMinify = env === 'dev' ? false : {
  minifyJS: true,
  minifyCSS: true,
  removeComments: true,
  collapseWhitespace: true
};
glob.sync(path.join(__dirname, '../src/html/pages/*.hbs')).forEach((filePath) => {
  const extname = path.extname(filePath);
  const filename = path.basename(filePath, extname);
  const conf = {
    filename: env === 'dev' ? `${filename}.html` : `html/${filename}.html`,
    template: `src/html/pages/${filename}${extname}`,
    inject: true,
    minify: htmlMinify,
  }

  if (filename in baseConfig.entry) {
    conf.chunks = [filename];
  }

  baseConfig.plugins.push(new HtmlWebpackPlugin(conf));
});

if (CONFIG.open) {
  const port = CONFIG.port || 8899;
  baseConfig.plugins.push(new OpenBrowserPlugin({ url: `http://localhost:${port}` }));
}

module.exports = baseConfig;
