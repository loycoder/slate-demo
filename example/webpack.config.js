const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const SpeedMeasurePlugin = require('speed-measure-webpack-plugin');
const ProgressBarPlugin = require('progress-bar-webpack-plugin');

const smp = new SpeedMeasurePlugin();

module.exports = smp.wrap({
  mode: 'development',
  entry: path.resolve(__dirname, 'demo/src/index.jsx'),
  devtool: 'inline-source-map',
  devServer: {
    static: {
      directory: path.resolve(__dirname, '..'),
    },
    proxy: {
      '/teaching-plan': {
        target: 'http://easinote1.test.seewo.com',
        changeOrigin: true
      } 
    },
  },
  resolve: {
    extensions: ['.js', '.json', '.jsx', '.tsx'],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, 'index.html'),
    }),
    // new BundleAnalyzerPlugin(),
    new ProgressBarPlugin({
      format: `  :msg [:bar] :percent (:elapsed s)`
    }),
  ],
  output: {
    filename: 'index.js',
    path: path.resolve(__dirname, 'dist'),
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: [
          'babel-loader?cacheDirectory',
        ],
      },
      {
        test: /\.(less|css)$/,
        use: ['style-loader', 'css-loader', 'less-loader'],
      },
      {
        test: /\.(jpg|png|gif|svg)$/,
        loader: 'url-loader',
        options: {
          limit: 25000,
        },
      },
    ],
  },
});