const { rspack } = require('@rspack/core');
const { resolve } = require('node:path');
const { builtinModules } = require('node:module');

const packageCfg = require('../package.json');
const outputPath = resolve('dist');
const tsConfig = resolve('tsconfig.json');

let externals = { electron: 'electron' };
builtinModules.forEach((e) => (externals[e] = e));
packageCfg.dependencies && Object.keys(packageCfg.dependencies).forEach((e) => (externals[e] = e));

/** @type {import('@rspack/core').Configuration} */
module.exports = (isDevelopment, envConfig) => ({
  mode: isDevelopment ? 'development' : 'production',
  target: 'node',
  entry: 'src/index.ts',
  output: {
    clean: true,
    path: outputPath,
    filename: `${packageCfg.productName}.js`
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
            transform: {
              legacyDecorator: true
            },
            parser: {
              syntax: 'typescript',
              tsx: false,
              decorators: true,
              dynamicImport: true
            },
            target: 'es2022'
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
  plugins: [
    new rspack.DefinePlugin({
      ...envConfig
    })
  ],
  externalsType: 'commonjs',
  externals
});
