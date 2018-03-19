const path = require('path');
const webpack = require('webpack');
const merge = require('webpack-merge');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const baseConfig = require('./webpack.base');
const cssMinimizeConfig = require('./cssmin');
const CONFIG = require('../config');

const prodConfig = merge(baseConfig, {
  module: {
    rules: [
      {
        test: /\.scss$/,
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: [
            {
              loader: 'css-loader',
              options: {
                minimize: cssMinimizeConfig
              }
            },
            {
              loader: 'postcss-loader',
              options: {
                config: {
                  path: path.resolve(__dirname, 'postcss.config.js')
                }
              }
            },
            'sass-loader'
          ]
        }),
        include: path.resolve(__dirname, '../src')
      },
      {
        test: /\.css$/,
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: [
            {
              loader: 'css-loader',
              options: {
                minimize: cssMinimizeConfig
              }
            }
          ]
        }),
        exclude: /node_modules/
      },
      {
        test: /\.hbs$/,
        include: path.resolve(__dirname, '../src'),
        loader: 'string-replace-loader',
        query: {
          search: /(\.?\.?\/?)+static\//,
          replace: `${CONFIG.prod.publicPath}static/`
        }
      }
    ]
  },
  plugins: [
    new CleanWebpackPlugin([CONFIG.prod.outputPath], {
      allowExternal: true,
    }),
    new ExtractTextPlugin(`css/[name]${CONFIG.hash ? '.[contenthash:7]' : ''}.css`),
    new UglifyJsPlugin({
      uglifyOptions: {
        compress: {
          drop_console: true,
          warnings: true,
        }
      }
    }),
    new webpack.DefinePlugin({
      '__DEV__': false,
      '__PROD__': true,
    })
  ],
});

if (CONFIG.react) {
  prodConfig.plugins.push(new webpack.optimize.CommonsChunkPlugin({
    name: "vendor",
    minChunks: (module) => {
      return module.context && module.context.includes("node_modules");
    }
  }), new webpack.optimize.CommonsChunkPlugin({
    name: "manifest",
    minChunks: Infinity
  }));
}

module.exports = prodConfig;
