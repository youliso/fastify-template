import { spawn } from 'node:child_process';
import { rspack } from '@rspack/core';
import rspackConfig from './rspack.config.mjs';

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

function spawns() {
  let args = ['dist/app.js'];
  if (process.env.npm_execpath.endsWith('yarn.js')) {
    args = args.concat(process.argv.slice(3));
  } else if (process.env.npm_execpath.endsWith('npm-cli.js')) {
    args = args.concat(process.argv.slice(2));
  }
  Mprocess = spawn('node', args, {
    cwd: path.resolve('./')
  });
  Mprocess.stdout.on('data', (data) => {
    const msg = data.toString().trim();
    msg &&
      console.log(
        `\x1b[34m[main stdout ${new Date().toLocaleTimeString()}]\x1b[0m: \x1b[1m${msg}\x1b[0m`
      );
  });
  Mprocess.stderr.on('data', (data) => {
    const msg = data.toString().trim();
    msg &&
      console.log(
        `\x1b[31m[main stderr ${new Date().toLocaleTimeString()}]\x1b[0m: \x1b[1;31m${msg}\x1b[0m`
      );
  });
  Mprocess.on('close', () => {
    if (!manualRestart) process.exit();
  });
}

bMain().then(() => spawns());
