require('./check-ver.js')();
const path = require('path');
const webpack = require('webpack');
const express = require('express');
const webpackDevMiddile = require('webpack-dev-middleware');
const webpackHotMiddle = require('webpack-hot-middleware');

if (!process.env.NODE_ENV) process.env.NODE_ENV = 'development';
const CONFIG = require('../config');
const devConfig = require('./webpack.dev.js');

const compiler = webpack(devConfig);
const middleware = [];

const app = express();
const port = CONFIG.port || 8899;

middleware.push(webpackDevMiddile(compiler, {
  logLevel: 'silent',
  logTime: true,
  stats: {
    colors: true
  },
  watchOptions: {
    ignored: /node_modules/,
    aggregateTimeout: 500,
    poll: 1000
  },
  publicPath: CONFIG.dev.publicPath,
}));

middleware.push(webpackHotMiddle(compiler, {
  log: false
}));

app.use(middleware);
app.listen(port, () => {
  console.log(`Server is listening at port ${port}:`);
});
