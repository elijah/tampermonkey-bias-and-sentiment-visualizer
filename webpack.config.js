/**
 * Webpack configuration for building the TamperMonkey extension
 */
const path = require('path');

module.exports = {
  entry: './src/index.js',
  output: {
    filename: 'tampermonkey-bias-visualizer.user.js',
    path: path.resolve(__dirname, 'dist'),
    libraryTarget: 'umd'
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env']
          }
        }
      }
    ]
  },
  mode: 'production',
  devtool: 'source-map'
};