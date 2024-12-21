const { spawn } = require('node:child_process');
const { rspack } = require('@rspack/core');
const path = require('node:path');
const { buildConfig } = require('./buildCfg.cjs');
const rspackConfig = require('./rspack.config.cjs');
const packageCfg = require('../package.json');

let Mprocess = null;
let manualRestart = false;

async function startMain(envConfig) {
  return new Promise((resolve) => {
    const watcher = rspack(rspackConfig(true, envConfig));
    watcher.watch(
      {
        aggregateTimeout: 300,
        poll: undefined
      },
      (err, stats) => {
        if (err || stats.hasErrors()) {
          if (err?.details) {
            console.error(err.details);
          }
          console.log(
            stats.toString({
              chunks: false, // 使构建过程更静默无输出
              colors: true // 在控制台展示颜色
            })
          );
          process.exit();
        }
        if (Mprocess && Mprocess.kill) {
          manualRestart = true;
          process.kill(Mprocess.pid);
          Mprocess = null;
          startElectron();
          setTimeout(() => {
            manualRestart = false;
          }, 5000);
        }
        resolve(0);
      }
    );
  });
}

function onLog(type, data) {
  let color = type === 'err' ? '31m' : '34m';
  const dataStr = data.toString(); // 将Buffer转换为字符串
  dataStr.split(/\r?\n/).forEach((line) => {
    if (line) {
      console.log(
        `\x1b[${color}[main ${new Date().toLocaleTimeString()}]\x1b[0m: \x1b[1;${type === 'err' ? color : '1m'}${line}\x1b[0m`
      );
    }
  });
}


function startApp() {
  let args = [`dist/${packageCfg.productName}.js`];
  if (process.env.npm_execpath.endsWith('yarn.js')) {
    args = args.concat(process.argv.slice(3));
  } else if (process.env.npm_execpath.endsWith('npm-cli.js')) {
    args = args.concat(process.argv.slice(2));
  }
  Mprocess = spawn('node', args, {
    cwd: path.resolve('./')
  });
  Mprocess.stdout.on('data', (data) => onLog('info', data));
  Mprocess.stderr.on('data', (data) => onLog('err', data));
  Mprocess.on('exit', (e) => {
    console.log('[exit]');
  });
  Mprocess.on('close', () => {
    if (!manualRestart) process.exit();
  });
}
const start = async () => {
  console.time('dev');
  const { envConfig } = await buildConfig();
  await startMain(envConfig).catch(console.error);
  startApp();
  console.timeEnd('dev');
};

start();
