const path = require('path')

const base = path.resolve(__dirname)

module.exports = {
  context: base,
  entry: './main.ts',
  output: {
    path: base,
    filename: '__build__.js'
  },
  resolve: {
    extensions: ['.js', '.ts'],
    alias: {
      vue$: 'vue/dist/vue.esm.js'
    }
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        loader: 'ts-loader'
      }
    ]
  },
  devServer: {
    contentBase: base
  }
}
