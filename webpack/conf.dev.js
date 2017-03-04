const fs = require('fs')
const webpack = require('webpack')
const merge = require('webpack-merge')

/* Config */
const host = '0.0.0.0'
const port = process.env.PORT || 8080
const urls = require('./urls')
const webpackConfBase = require('./conf.base')

/* Webpack Plugins */
const FriendlyErrorsWebpackPlugin = require('friendly-errors-webpack-plugin')
const OpenBrowserPlugin = require('open-browser-webpack-plugin')

webpackConfBase.entry.manifest.unshift(
  'react-hot-loader/patch',
  `webpack-dev-server/client?http://${host}:${port}`,
  'webpack/hot/only-dev-server'
)

const webpackConf = merge(webpackConfBase, {
  cache: true,
  devtool: '#source-map',
  plugins: [
    new webpack.DefinePlugin({
      'process.env': { NODE_ENV: '"development"' }
    }),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoEmitOnErrorsPlugin(),
    new webpack.NamedModulesPlugin(),
    new FriendlyErrorsWebpackPlugin(),
    new OpenBrowserPlugin({ url: `http://${host}:${port}` })
  ]
})

fs.writeFileSync(`${urls.temp}/config.dev.json`, JSON.stringify(webpackConf, null, 2), 'utf8')

module.exports = webpackConf
