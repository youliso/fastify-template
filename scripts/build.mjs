import fs from 'node:fs';
import pkg from '@yao-pkg/pkg';
import { rspack } from '@rspack/core';
import rspackConfig from './rspack.config.mjs';
import packageCfg from '../package.json' assert { type: 'json' };

const [, , type, platform, nodev, nodex, nobytecode] = process.argv;
const isNobytecode = nobytecode === 'nobytecode';

rspack(rspackConfig(false), (err, stats) => {
  if (err || stats.hasErrors()) {
    console.error(err.stack || err);
    if (err.details) {
      console.error(err.details);
    }
    console.log(`\x1B[31mFailed to build main process !\x1B[0m`);
    process.exit(1);
  }
  fs.writeFileSync(
    './dist/package.json',
    JSON.stringify(
      {
        name: packageCfg.name,
        version: packageCfg.version,
        dependencies: packageCfg.dependencies
      },
      null,
      2
    )
  );

  if (type) {
    let cmd = [`dist/${packageCfg.productName}.js`, '--out-path', 'out', '--compress', 'Brotli', '-t'];
    isNobytecode && cmd.push(...['--no-bytecode', '--public']);
    const v = nodev || '20';
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
