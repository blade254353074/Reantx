const path = require('path')
const fs = require('fs-extra')
const glob = require('glob')
const urls = require('./urls')
const PROD = process.env.NODE_ENV === 'production'
const ORIGIN = process.env.ORIGIN
const templateExt = ['ejs', 'hbs', 'html']
const htmlVar = { ORIGIN }

function fileExist (path) {
  try {
    fs.accessSync(path, fs.constants.R_OK)
    return true
  } catch (err) {
    return false
  }
}

function constructEntries (templateFiles) {
  const pagesAttr = []
  templateFiles.map(template => {
    const dir = path.dirname(template)
    // key `dir/subpage1` or `poage1`
    const key = path.dirname(path.relative(urls.pages, template))
    const templateKey = `[template]${encodeURIComponent(key)}` // 让 template 模板可追踪
    const jsPath = path.resolve(dir, 'main.js')
    const entryPath = path.resolve(dir, 'entry.json') // 自定义 entry
    const page = {
      key,
      templateKey,
      template
    }

    if (fileExist(jsPath)) page.js = jsPath
    if (fileExist(entryPath)) page.entry = JSON.parse(fs.readFileSync(entryPath, 'utf8'))

    /*
      page {
        key: 'dir/subpage1',
        templateKey: '<template>-dir/subpage1',
        template: '/absolute/path/to/dir/subpage1/main.html',
        js: './src/pages/dir/subpage1/main.js' // optional
      }
    */
    pagesAttr.push(page)
  })

  return pagesAttr
}

function constructEntryObject (pagesAttr, type) {
  let entry = {}
  pagesAttr.map(page => {
    let entryPart = { [page.key]: [] }
    // 'dir/subpage1': [ jspath, htmlpath ]
    if (!PROD) {
      entryPart[page.key].push(page.template)
    }
    if (page.js) {
      entryPart[page.key].push(page.js)
    }

    Object.assign(entry, entryPart)
  })

  // 过滤无入口的键
  for (let key in entry) {
    if (entry[key].length < 1) {
      delete entry[key]
    }
  }

  return entry
}

function constructHtmlPluginsConfigArray (pagesAttr) {
  return pagesAttr.map(page => {
    const dependencies = page.entry || ['manifest', 'libs', 'vendor']
    let inject = true
    let chunks
    let config
    if (!PROD) {
      chunks = [page.templateKey].concat(dependencies)
    } else { // 生产环境
      chunks = dependencies
    }
    config = {
      _key: page.key,
      _templateKey: page.templateKey,
      cache: false,
      filename: `${page.key}.html`,
      template: page.template,
      chunksSortMode: 'dependency',
      favicon: urls.favicon,
      chunks,
      inject,
      htmlVar
    }

    if (page.js) {
      config.chunks.push(page.key)
    }
    /*
      config {
        _key: 'dir/page',
        _templateKey: '<template>-dir/page',
        filename: 'dir/page.html',
        template: '/path/to/dir/page/main.html',
        favicon: '/path/to/favicon.ico'
        chunks: ['vendor', 'dir/page'],
        inject: true
      }
    */
    return config
  })
}

function getPagesConfig () {
  try {
    const templateFiles = glob.sync(`${urls.pages}/**/main.+(${templateExt.join('|')})`)
    const pagesAttr = constructEntries(templateFiles)
    const entry = constructEntryObject(pagesAttr) // Object
    const htmls = constructHtmlPluginsConfigArray(pagesAttr) // Array
    fs.ensureDirSync(urls.temp) // Create .temp dir

    return { entry, htmls }
  } catch (err) {
    console.log('\\007') // Beep
    console.error(err)
  }
}

module.exports = getPagesConfig()
