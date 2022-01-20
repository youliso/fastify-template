const path = require('path');
const fs = require('fs');
const pack = require('../package.json');
const webpack = require('webpack');
const pkg = require('pkg');
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

mainCfg.plugins.push(
  new CopyWebpackPlugin({
    patterns
  })
);

for (const i in pack.dependencies) mainCfg.externals[i] = `require("${i}")`;

webpack(mainCfg, (err, stats) => {
  if (err || stats.hasErrors()) {
    // 在这里处理错误
    console.log(stats, err);
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

  if (type) {
    let cmd = ['dist/app.js', '--out-path', 'out', '--compress', 'Brotli', '-t'];
    switch (type) {
      case 'pkg':
        switch (process.platform) {
          case 'win32':
            cmd.push('node16-win-x64');
            break;
          case 'linux':
            cmd.push('node16-linux-x64');
            break;
          case 'darwin':
            cmd.push('node16-macos-x64');
            break;
        }
        break;
      case 'pkga':
        cmd.push('node16-macos-x64,node16-linux-x64,node16-win-x64');
        break;
    }
    pkg.exec(cmd);
  }
});
