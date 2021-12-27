const path = require('path');
const fs = require('fs');
const CopyWebpackPlugin = require('copy-webpack-plugin');

let patterns = [
  {
    from: path.resolve('resources'),
    to: path.resolve('dist/resources')
  }
];

try {
  fs.accessSync(path.resolve('out'));
  patterns.push({
    from: path.resolve('resources'),
    to: path.resolve('out/resources')
  });
} catch (error) {}

module.exports = (env) => {
  return {
    experiments: {
      topLevelAwait: true
    },
    devtool: env === 'production' ? undefined : 'eval-cheap-source-map',
    mode: env,
    target: 'node',
    entry: {
      app: './src/index.ts'
    },
    output: {
      filename: '[name].js',
      chunkFilename: '[id].bundle.js',
      path: path.resolve('dist')
    },
    optimization: {
      minimize: env === 'production'
    },
    module: {
      rules: [
        {
          test: /\.(ts|js)$/,
          exclude: /(node_modules|bower_components)/,
          use: {
            loader: 'swc-loader',
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
            }
          }
        }
      ]
    },
    externals: {},
    resolve: {
      extensions: ['.ts', '.js'],
      alias: {
        dist: path.resolve('dist'),
        '@': path.resolve('src')
      }
    },
    plugins: [
      new CopyWebpackPlugin({
        patterns
      })
    ]
  };
};
