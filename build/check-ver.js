const semver = require('semver');
const chalk = require('chalk');
const packageConfig = require('../package.json');

const exec = (cmd) => {
  return require('child_process')
    .execSync(cmd).toString().trim();
}

const versionRequirements = [
  {
    name: 'node',
    currentVersion: semver.clean(process.version),
    versionRequirement: packageConfig.engines.node
  },
  {
    name: 'npm',
    currentVersion: exec('npm --version'),
    versionRequirement: packageConfig.engines.npm
  }
];

module.exports = function () {
  const warnings = [];
  for (let i = 0; i < versionRequirements.length; i += 1) {
    const mod = versionRequirements[i];
    if (!semver.satisfies(mod.currentVersion, mod.versionRequirement)) {
      warnings.push(`当前 ${mod.name} 版本为: ${chalk.red(mod.currentVersion)}, 应该为: ${chalk.green(mod.versionRequirement)}`);
    }
  }

  if (warnings.length) {
    console.log();
    console.log(chalk.yellow('请更新环境以支持该工作流:'));
    console.log(chalk.yellow('推荐使用nvm管理node版本，以保留各版本下的开发环境:'));
    console.log();
    for (let i = 0; i < warnings.length; i += 1) {
      const warning = warnings[i];
      console.log('  ' + warning);
    }
    console.log();
    process.exit(1);
  }
}
