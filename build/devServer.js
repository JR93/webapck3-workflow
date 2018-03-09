require('./check-ver')();
const path = require('path');
const webpack = require('webpack');
const express = require('express');
const webpackDevMiddile = require('webpack-dev-middleware');
const webpackHotMiddle = require('webpack-hot-middleware');
const logger = require('./logger');

if (!process.env.NODE_ENV) process.env.NODE_ENV = 'development';
const CONFIG = require('../config');
const devConfig = require('./webpack.dev');

const compiler = webpack(devConfig);
const middleware = [];

logger.info('正在执行 dev 任务...');

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
  logger.success(`Server is listening at port ${port}:`);
});
