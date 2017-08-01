import { resolve } from 'path'
import webpack from 'webpack'
import baseConfig from './webpack.config.base.babel'

import ExtractTextPlugin from 'extract-text-webpack-plugin'
import HtmlWebpackPlugin from 'html-webpack-plugin'
const UglifyJsPlugin = webpack.optimize.UglifyJsPlugin

const config = {
  ...baseConfig,
  module: {
    ...baseConfig.module,
    // replace style loaders with extract text plugin
    rules: baseConfig.module.rules.map((rule) =>
      rule.use
        .map(({ loader }) => loader)
        .includes('style-loader')
        ? ({
          ...rule,
          use: ExtractTextPlugin.extract({
            fallback: 'style-loader',
            use: rule.use.filter(({ loader }) => loader !== 'style-loader')
          })
        })
        : rule
    )
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
    new ExtractTextPlugin({
      filename: 'style.css',
      allChunks: true
    }),
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
