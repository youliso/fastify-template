const path = require('path');

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
      clean: true,
      filename: '[name].js',
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
    plugins: []
  };
};
