const webpack = require('webpack')
const WebpackDevServer = require('webpack-dev-server')

const host = '0.0.0.0'
const port = process.env.PORT || 8080
const webpackConfDev = require('./conf.dev')
const { publicPath } = webpackConfDev.entry

const compiler = webpack(webpackConfDev)
const server = new WebpackDevServer(compiler, {
  hot: true,
  quiet: true,
  publicPath,
  stats: {
    colors: true,
    timings: true,
    assets: false,
    chunks: true,
    chunkModules: false
  }
})

server.listen(port, host, err => {
  if (err) return console.error(err)
  console.info(`Server listening at ${host}:${port}\n`)
})
