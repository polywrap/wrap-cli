const path = require('path');
const WorkerPlugin = require('worker-plugin');

module.exports = {
  mode: 'development',
  entry: './src/wasm/thread.ts',
  resolve: {
    extensions: [".ts", ".js"],
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        loader: 'ts-loader',
        options: {
          configFile: 'tsconfig.thread.json'
        }
      },
    ],
  },
  output: {
    filename: 'thread.js',
    path: path.resolve(__dirname, 'build'),
    libraryTarget: 'umd',
    globalObject: 'typeof self !== \'undefined\' ? self : this'
  },
  plugins: [
    new WorkerPlugin()
  ]
};
