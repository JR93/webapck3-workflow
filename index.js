const program = require('commander');
const shell = require('shelljs');

const version = require('./package.json').version;

function exec(cmd, options = {}) {
  return new Promise((resolve, reject) => {
    shell.exec(cmd, options, (code, stdout, stderr) => {
      if (code !== 0) {
        reject(new Error(stderr));
      } else {
        resolve(new shell.ShellString(stdout, stderr, code));
      }
    });
  });
}

program
  .version(version);

program
  .command('dev')
  .alias('d')
  .action(() => {
    exec('node ./build/devServer.js --color');
  });

program
  .command('prod')
  .alias('p')
  .action(() => {
    exec('node ./build/prodServer.js --color');
  });

program
  .command('help')
  .alias('h')
  .action(() => {
    console.log('  Usage:');
    console.log();
    console.log('    fetool dev');
    console.log('    fetool prod');
    console.log();
  });

program.parse(process.argv);
