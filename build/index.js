const path = require('path');
const { exec } = require('child_process');
const fs = require('fs');
const pack = require('../package.json');
const webpack = require('webpack');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const mainCfg = require('./webpack.config')('production'); //主进程
const [, , type] = process.argv;

let patterns = [
  {
    from: path.resolve('resources'),
    to: path.resolve('dist/resources')
  }
];

if (type === 'pkg') {
  patterns.push({
    from: path.resolve('resources'),
    to: path.resolve('out/resources')
  });
}

function deleteFolderRecursive(url) {
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
  } else {
    console.log('...');
  }
}
// 清除dist
deleteFolderRecursive(path.resolve('dist'));
mainCfg.plugins.push(
  new CopyWebpackPlugin({
    patterns
  })
);
for (const i in pack.dependencies) mainCfg.externals[i] = `require("${i}")`;
webpack([mainCfg], (err, stats) => {
  if (err || stats.hasErrors()) {
    // 在这里处理错误
    console.log(stats.stats[0], err);
    throw err;
  }
  fs.writeFileSync(
    './dist/package.json',
    JSON.stringify(
      {
        name: pack.name,
        version: pack.version,
        dependencies: pack.dependencies
      },
      null,
      2
    )
  );

  if (type === 'pkg') {
    exec(
      'pkg dist/app.js -c build/pkg.json --compress Brotli',
      {
        cwd: path.resolve()
      },
      (error, stdout, stderr) => {
        if (error) {
          console.error(error);
          return;
        }
        console.log(stdout);
        console.log(stderr);
      }
    );
  }
});
