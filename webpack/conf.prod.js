const fs = require('fs')
const webpack = require('webpack')
const merge = require('webpack-merge')

/* Webpack Plugins */
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const ImageminPlugin = require('imagemin-webpack-plugin').default
const imageminMozjpeg = require('imagemin-mozjpeg')
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin
const BabiliPlugin = require("babili-webpack-plugin")

/* Config */
const urls = require('./urls')
const webpackConfBase = require('./conf.base')

const webpackConf = merge(webpackConfBase, {
  // devtool: '#source-map', // if you need sourceMaps
  profile: true,
  output: {
    filename: 'assets/js/[name].[chunkhash:8].js',
    chunkFilename: 'assets/js/[name].[chunkhash:8].js'
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: '"production"'
      }
    }),
    // new webpack.optimize.UglifyJsPlugin({
    //   compress: {
    //     screw_ie8: true,
    //     warnings: false,
    //     collapse_vars: false,
    //     reduce_vars: true
    //   },
    //   output: { comments: false },
    //   sourceMap: false
    // }),
    new BabiliPlugin(),
    new ImageminPlugin({
      disable: false,
      optipng: { optimizationLevel: 3 },
      gifsicle: { optimizationLevel: 1 },
      jpegtran: { progressive: false },
      svgo: { plugins: [{ removeViewBox: false }] },
      pngquant: { quality: '70-85' },
      plugins: [imageminMozjpeg({ quality: 90 })]
    }),
    new webpack.optimize.AggressiveMergingPlugin(),
    new webpack.optimize.MinChunkSizePlugin({ minChunkSize: 10000 }),
    new ExtractTextPlugin('assets/css/[name].[contenthash:8].css'),
    new webpack.HashedModuleIdsPlugin()
  ]
})

// npm run build --analyse
process.env.npm_config_analyse && webpackConf.plugins.push(new BundleAnalyzerPlugin())
fs.writeFileSync(`${urls.temp}/config.prod.json`, JSON.stringify(webpackConf, null, 2), 'utf8')

module.exports = webpackConf
