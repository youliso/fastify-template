
const fs = require('node:fs');
const path = require('node:path');
const pkg = require('@yao-pkg/pkg');
const { rspack } = require('@rspack/core'); 
const rspackConfig = require('./rspack.config.cjs');

const deleteFolderRecursive = (url) => {
  let files = [];
  if (fs.existsSync(url)) {
    files = fs.readdirSync(url);
    files.forEach(function (file, index) {
      let curPath = path.join(url, file);
      if (fs.statSync(curPath).isDirectory()) {
        // recurse
        deleteFolderRecursive(curPath);
      } else {
        fs.unlinkSync(curPath);
      }
    });
    fs.rmdirSync(url);
  }
}

const rsPackBuild = (envConfig) => {
  return new Promise((resolve) => {
    rspack(rspackConfig(false, envConfig),
      (err, stats) => {
        if (err || stats.hasErrors()) {
          console.error(err.stack || err);
          if (err.details) {
            console.error(err.details);
          }
          console.log(`\x1B[31mFailed to build main process !\x1B[0m`);
          process.exit(1);
        }
        console.log(
          stats.toString({
            chunks: false, // 使构建过程更静默无输出
            colors: true // 在控制台展示颜色
          })
        );
        resolve(0);
      }
    );
  });
}

const build = async (envConfig, buildConfig) => {
  console.log(`\x1B[34m[build start]\x1B[0m`);
  deleteFolderRecursive(path.resolve('dist')); //清除dist
  await rsPackBuild(envConfig);
  if (buildConfig && buildConfig.cmd && buildConfig.cmd.length) {
    pkg.exec(buildConfig.cmd);
  }
}

module.exports = {
  build
}