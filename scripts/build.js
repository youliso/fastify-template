const path = require('path');
const fs = require('fs');
const pack = require('../package.json');
const webpack = require('webpack');
const pkg = require('pkg');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const mainCfg = require('./webpack.config')('production'); //主进程
const [, , type, platform, nodev, nodex, nobytecode] = process.argv;
const isNobytecode = nobytecode === 'nobytecode';

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
    isNobytecode && cmd.push(...['--no-bytecode', '--public']);
    const v = nodev || '16';
    const x = nodex || 'x64';
    switch (type) {
      case 'pkg':
        switch (platform || process.platform) {
          case 'w':
          case 'win':
          case 'win32':
            cmd.push(`node${v}-win-${x}`);
            break;
          case 'l':
          case 'linux':
            cmd.push(`node${v}-linux-${x}`);
            break;
          case 'm':
          case 'mac':
          case 'darwin':
            cmd.push(`node${v}-macos-${x}`);
            break;
        }
        break;
      case 'pkga':
        cmd.push(`node${v}-macos-${x},node${v}-linux-${x},node${v}-win-${x}`);
        break;
    }
    pkg.exec(cmd);
  }
});
