const path = require('path')

module.exports = {
  entry: '../../dist/apps/ui/src/index.js',
  target: 'electron-renderer',
  output: {
    path: path.resolve(__dirname, '.webpack/renderer'),
    filename: 'index.js',
  },
  resolve: {
    fallback: {
      fs: false,
    },
  },
}
