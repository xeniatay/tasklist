var path = require('path');
var webpack = require('webpack');

module.exports = {
  entry: './js/main.js',
  devtool: "source-map",
  output: {
    path: __dirname + '/build',
    publicPath: '/build/',
    filename: 'bundle.js'
  },
  module: {
    loaders: [
      {
        test: /.jsx?$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
        query: {
          presets: ['es2015', 'react', 'stage-0']
        }
      },
      {
        test: /\.css/,
        loaders: ['style-loader', 'css-loader'],
        include: __dirname + '/css'
      },
      {
        test: /\.scss$/,
        loaders: ["style-loader", "css-loader", "sass-loader"],
        include: [
          path.resolve(__dirname, 'css'),
          path.resolve(__dirname, 'node_modules/bootstrap/scss')
        ]
      },
      { test: /\.(png|woff|woff2|eot|ttf|svg)$/,
        loader: 'url-loader?limit=100000',
        include: __dirname + '/css'
      }
    ]
  },
}
