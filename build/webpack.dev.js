const path = require('path');
const webpack = require('webpack');
const merge = require('webpack-merge');
const FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin');
const baseConfig = require('./webpack.base.js');
const CONFIG = require('../config');

const hotMiddlewareScript = 'webpack-hot-middleware/client?reload=true&noInfo=true';
Object.keys(baseConfig.entry).forEach((name) => {
  baseConfig.entry[name] = [hotMiddlewareScript].concat(baseConfig.entry[name]);
});

const devConfig = merge(baseConfig, {
  module: {
    rules: [
      {
        test: /\.scss$/,
        use: [
          'style-loader',
          'css-loader?sourceMap',
          {
            loader: 'postcss-loader',
            options: {
              sourceMap: true,
              config: {
                path: path.resolve(__dirname, 'postcss.config.js')
              }
            }
          },
          'sass-loader?sourceMap'
        ],
        include: path.resolve(__dirname, '../src')
      },
      {
        test: /\.css$/,
        use: [
          'style-loader',
          'css-loader?sourceMap'
        ],
        exclude: /node_modules/
      },
    ]
  },
  plugins: [
    new FriendlyErrorsPlugin(),
    new webpack.NamedModulesPlugin(),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoEmitOnErrorsPlugin(),
    new webpack.DefinePlugin({
      '__DEV__': true,
      '__PROD__': false,
    })
  ]
});

module.exports = devConfig;
