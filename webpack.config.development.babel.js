import { resolve } from 'path'
import webpack from 'webpack'
import express from 'express'
import baseConfig from './webpack.config.base.babel'

import HtmlWebpackPlugin from 'html-webpack-plugin'
import DashboardPlugin from 'webpack-dashboard/plugin'

const host = process.env.HOST || '0.0.0.0'
const port = 9000

const config = {
  ...baseConfig,
  devtool: 'cheap-module-eval-source-map',
  entry: [
    'react-hot-loader/patch',
    `webpack-dev-server/client?http://${host}:${port}`,
    'webpack/hot/only-dev-server',
    resolve(__dirname, 'src/app/index.js')
  ],
  output: {
    publicPath: `http://${host}:${port}/`,
    filename: 'bundle.js'
  },
  devServer: {
    host: host,
    port: port,
    headers: {'Access-Control-Allow-Origin': '*'},
    hot: true,
    stats: 'minimal',
    setup (app) {
      app.use('/data/isochrone/isochrones', express.static(resolve(__dirname, 'src/lib/overlays/isochrone/data/isochrones')))
    },
    disableHostCheck: true
  },
  plugins: [
    ...baseConfig.plugins,
    new DashboardPlugin(),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NamedModulesPlugin(),
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
