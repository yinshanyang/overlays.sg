import { resolve } from 'path'
import webpack from 'webpack'

const config = {
  module: {
    loaders: [
      {
        test: /(\.jsx|\.js)$/,
        include: resolve(__dirname, 'src'),
        use: [
          {
            loader: 'babel-loader'
          },
          {
            loader: 'eslint-loader'
          }
        ]
      },
      {
        test: /(\.css)$/,
        include: resolve(__dirname, 'src'),
        use: [
          {
            loader: 'style-loader'
          },
          {
            loader: 'css-loader',
            options: {
              importLoaders: 1,
              modules: true
            }
          },
          {
            loader: 'postcss-loader'
          }
        ]
      },
      {
        test: /(\.css)$/,
        include: resolve(__dirname, 'node_modules'),
        use: [
          {
            loader: 'style-loader'
          },
          {
            loader: 'css-loader'
          }
        ]
      },
      {
        test: /(\.json|\.csv)$/,
        include: resolve(__dirname, 'src'),
        use: [
          {
            loader: 'file-loader',
            options: {
              name: 'data/[hash].[ext]',
              useRelativePath: true
            }
          }
        ]
      }
    ]
  },
  resolve: {
    alias: {}
  },
  externals: [],
  plugins: [
    new webpack.EnvironmentPlugin(['NODE_ENV'])
  ],
  stats: 'minimal'
}

export default config
