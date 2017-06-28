import path from 'path'
import baseConfig from './webpack.config.base.babel.js'

const config = {
  ...baseConfig,
  context: path.resolve(__dirname, 'src/lib'),
  entry: [
    path.resolve(__dirname, 'src/lib/index.js')
  ],
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'lib.min.js'
  }
}

export default config
