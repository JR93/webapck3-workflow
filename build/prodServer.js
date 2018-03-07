require('./check-ver.js')();
const webpack = require('webpack');
const express = require('express');
const chalk = require('chalk');

if (!process.env.NODE_ENV) process.env.NODE_ENV = 'production';
const CONFIG = require('../config');
const prodConfig = require('./webpack.prod.js');

webpack(prodConfig, (err) => {
  if (err) {
    console.log(chalk.red('哎呀~ 出错了：'));
    console.log(err);
  } else {
    console.log(chalk.green.bold('\n', '打包构建完成~'));
    const app = express();
    const port = CONFIG.port || 8899;
    app.use(express.static(CONFIG.prod.outputPath));
    app.listen(port, () => {
      console.log(`Server is listening at port ${port}:`);
    });
  }
});
