
const packageCfg = require('../package.json');
const { build } = require('./build.cjs');
const { buildConfig } = require('./buildCfg.cjs');

const [, , type, platform, nodev, nodex, nobytecode] = process.argv;
const core = async () => {
  let cmd = [];
  if (type) {
    cmd = [`dist/${packageCfg.productName}.js`, '--out-path', 'out', '--compress', 'Brotli', '-t'];
    nobytecode === 'nobytecode' && cmd.push(...['--no-bytecode', '--public']);
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
  }
  const cfg = await buildConfig();
  await build(cfg.envConfig, { cmd });
}

core();