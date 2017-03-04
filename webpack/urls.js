const fs = require('fs-extra')
const path = require('path')
const cwd = process.cwd()

// __dirname js 文件路径
// process.cwd() node 运行的路径
// path.resolve('node_modules') node 运行时路径 + node_modules
const src = path.resolve('src')

const urls = {
  /* base urls */
  project: cwd,
  src: src,
  build: path.resolve('build'),
  node_modules: path.resolve('node_modules'),
  temp: path.resolve('.temp'),
  webpack: path.resolve('webpack'),
  pages: path.resolve(src, 'pages'),
  favicon: path.resolve(src, 'assets/favicon.ico'),
  /* resource urls */
  assets: path.resolve(src, 'assets'),
  components: path.resolve(src, 'components'),
  utils: path.resolve(src, 'utils'),
  bootstrap: path.resolve(src, 'libs/bootstrap.js'),
  ready: path.resolve(src, 'libs/ready.js')
}

fs.ensureDirSync(urls.temp)

module.exports = urls
