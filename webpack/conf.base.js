const webpack = require('webpack')

/* Plugins */
const autoprefixer = require('autoprefixer')
const HappyPack = require('happypack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const InlineManifestWebpackPlugin = require('inline-manifest-webpack-plugin')
const styles = require('./styles')

/* vars */
const urls = require('./urls')
const entries = require('./entries-generator')
const exclude = /(node_modules|bower_components)/
const prod = process.env.NODE_ENV === 'production'
const postcssPlugins = [autoprefixer({ browsers: ['Chrome >= 52'] })]
const entry = {
  manifest: [urls.bootstrap],
  libs: [
    'es6-promise/auto',
    'react',
    'react-dom',
    'react-router',
    'mobx',
    'axios'
  ],
  vendor: urls.ready
}

module.exports = {
  entry: Object.assign(entry, entries.entry),
  output: {
    path: urls.build,
    publicPath: '/',
    filename: 'assets/js/[name].js',
    chunkFilename: 'assets/js/chunk.[name].js'
  },
  resolve: {
    extensions: ['.js', '.jsx', '.css', '.scss', '.gif', '.png', '.jpg', '.jpeg'],
    alias: {
      assets: urls.assets,
      utils: urls.utils,
      components: urls.components,
      'babel-runtime/core-js/promise': 'es6-promise'
    }
  },
  performance: {
    hints: prod ? 'warning' : false
  },
  module: {
    rules: [{
      enforce: 'pre',
      test: /\.jsx?$/,
      loader: 'standard-loader',
      exclude,
      options: {
        parser: 'babel-eslint',
        parserOptions: { ecmaVersion: 7 },
        globals: ['React']
      }
    }, {
      test: /\.jsx?$/,
      loader: 'happypack/loader',
      exclude
    },
      ...styles.style({ sourceMap: !prod, extract: prod }),
    {
      test: /\.(jpe?g|png|gif|svg)$/i,
      loader: 'url-loader',
      options: {
        limit: 4096,
        name: 'assets/imgs/[name].[hash:8].[ext]'
      }
    }, {
      test: /\.(woff2?|eot|ttf|otf)$/i,
      loader: 'url-loader',
      options: {
        limit: 10000,
        name: 'assets/fonts/[name].[hash:8].[ext]'
      }
    }, {
      test: /\.html$/,
      loader: 'html-loader'
    }, {
      test: /\.ejs$/,
      loader: 'ejs-loader'
    }]
  },
  plugins: [
    new webpack.LoaderOptionsPlugin({
      debug: !prod,
      minimize: prod,
      options: {
        context: urls.project,
        postcss: postcssPlugins
      }
    }),
    new HappyPack({
      loaders: [ 'babel-loader?cacheDirectory' ],
      tempDir: '.temp/.happypack/'
    }),
    new webpack.ProvidePlugin({
      React: 'react'
    }),
    new webpack.optimize.CommonsChunkPlugin({
      names: ['manifest', 'libs', 'vendor'].reverse()
    }),
    new InlineManifestWebpackPlugin(),
    ...entries.htmls.map(conf => new HtmlWebpackPlugin(conf))
  ]
}
