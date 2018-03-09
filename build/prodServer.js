require('./check-ver')();
const webpack = require('webpack');
const express = require('express');
const logger = require('./logger');

if (!process.env.NODE_ENV) process.env.NODE_ENV = 'production';
const CONFIG = require('../config');
const prodConfig = require('./webpack.prod');

logger.info('正在执行 prod 任务...');

webpack(prodConfig, (err) => {
  if (err) {
    logger.error('出现了错误：');
    console.log(err);
  } else {
    console.log();
    logger.success('打包构建完成~');
    console.log();
    const app = express();
    const port = CONFIG.port || 8899;
    app.use(express.static(CONFIG.prod.outputPath));
    app.listen(port, () => {
      logger.success(`Server is listening at port ${port}:`);
    });
  }
});
