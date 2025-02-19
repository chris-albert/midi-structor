const path = require('path')

module.exports = {
  entry: {
    main: './src/index.ts',
    preload: './src/preload.ts',
  },
  target: 'electron-main',
  output: {
    path: path.resolve(__dirname, '.webpack/main'),
    filename: '[name].js',
  },
  module: {
    rules: [{ test: /\.ts$/, use: 'ts-loader' }],
  },
  resolve: {
    extensions: ['.ts'],
    fallback: {
      fs: false,
    },
  },
}
