import { resolve } from 'path'
import webpack from 'webpack'
import baseConfig from './webpack.config.base.babel'

import ExtractTextPlugin from 'extract-text-webpack-plugin'
import HtmlWebpackPlugin from 'html-webpack-plugin'
const UglifyJsPlugin = webpack.optimize.UglifyJsPlugin

const config = {
  ...baseConfig,
  module: {
    ...baseConfig.module
  },
  entry: [
    resolve(__dirname, 'src/app/index.js')
  ],
  output: {
    path: resolve(__dirname, 'example'),
    filename: 'bundle.min.js'
  },
  plugins: [
    ...baseConfig.plugins,
    new ExtractTextPlugin(
      {
        filename: 'styles.css',
        allChunks: true
      }
    ),
    new UglifyJsPlugin({
      compress: {
        warnings: false,
        comparisons: false
      }
    }),
    new HtmlWebpackPlugin({
      title: 'Isochronic Singapore',
      template: require('html-webpack-template'),
      mobile: true,
      inject: false,
      scripts: [
        'https://maps.googleapis.com/maps/api/js?libraries=places&key=AIzaSyD_c-n0mMsuEz2OSYN23bFivju2hbajC9A'
      ]
    })
  ]
}

export default config
