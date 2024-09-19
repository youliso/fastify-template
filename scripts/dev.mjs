import { spawn } from 'node:child_process';
import { rspack } from '@rspack/core';
import path from 'node:path';
import rspackConfig from './rspack.config.mjs';
import packageCfg from '../package.json' assert { type: 'json' };

let Mprocess = null;
let manualRestart = false;

async function bMain() {
  return new Promise((resolve) => {
    const watcher = rspack(rspackConfig(true));
    watcher.watch(
      {
        aggregateTimeout: 500, poll: 1000, ignored: /node_modules/
      },
      (err, stats) => {
        if (err || stats.hasErrors()) {
          console.error(err?.stack || err);
          if (err?.details) {
            console.error(err.details);
          } else {
            console.error(stats.toString());
          }
          throw new Error('Error occured in main process');
        }
        if (Mprocess && Mprocess.kill) {
          manualRestart = true;
          process.kill(Mprocess.pid);
          Mprocess = null;
          spawns();
          setTimeout(() => {
            manualRestart = false;
          }, 5000);
        }
        resolve(1);
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

function spawns() {
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

bMain().then(() => spawns());
