import { rspack } from '@rspack/core';
import { resolve } from 'node:path';
import { builtinModules } from 'node:module';
import packageCfg from '../package.json' assert { type: 'json' };
import ENV from './.env.json' assert { type: 'json' };

const outputPath = resolve('dist');
const tsConfig = resolve('tsconfig.json');

let plugins = [
  new rspack.DefinePlugin({
    ...ENV
  })
];
let externals = { electron: 'electron' };
builtinModules.forEach((e) => (externals[e] = e));
packageCfg.dependencies && Object.keys(packageCfg.dependencies).forEach((e) => (externals[e] = e));

/** @type {import('@rspack/core').Configuration} */
export default (isDevelopment) => ({
  mode: isDevelopment ? 'development' : 'production',
  target: 'node',
  entry: 'src/index.ts',
  output: {
    clean: true,
    path: outputPath,
    filename: 'index.js'
  },
  resolve: {
    alias: {
      '@': resolve('src')
    },
    extensions: ['.mjs', '.ts', '.js', '.json', '.node'],
    tsConfig
  },
  optimization: {
    minimize: !isDevelopment
  },
  module: {
    rules: [
      {
        test: /\.(ts|js)$/,
        exclude: [/node_modules/],
        loader: 'builtin:swc-loader',
        options: {
          jsc: {
            parser: {
              syntax: 'typescript'
            }
          }
        },
        type: 'javascript/auto'
      },
      {
        test: /\.(png|jpg|jpeg|gif|svg)$/i,
        type: 'asset/resource'
      }
    ]
  },
  plugins,
  externalsType: 'commonjs',
  externals
});
