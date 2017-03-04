const ExtractTextPlugin = require('extract-text-webpack-plugin')

exports.css = function cssLoaders (options = {}) {
  function generateLoaders (loaders) {
    if (options.style) loaders.splice(1, 0, 'postcss')
    const sourceLoader = loaders.map(function (loader) {
      let extraParamChar
      if (/\?/.test(loader)) {
        loader = loader.replace(/\?/, '-loader?')
        extraParamChar = '&'
      } else {
        loader = `${loader}-loader`
        extraParamChar = '?'
      }
      return loader + (options.sourceMap ? `${extraParamChar}sourceMap` : '')
    }).join('!')

    return options.extract
      ? ExtractTextPlugin.extract({ fallback: 'style-loader', use: sourceLoader })
      : ['style-loader', sourceLoader].join('!')
  }

  return {
    css: generateLoaders(['css']),
    less: generateLoaders(['css', 'less']),
    scss: generateLoaders(['css', 'sass']),
    styl: generateLoaders(['css', 'stylus'])
  }
}

exports.style = function styleLoaders (options) {
  options.style = true
  const loaders = exports.css(options)
  const output = []

  for (let ext in loaders) {
    output.push({
      test: new RegExp(`\\.${ext}$`),
      loader: loaders[ext]
    })
  }

  return output
}
