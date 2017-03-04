# Reantx - with newest build tool config

[![Standard - JavaScript Style Guide](https://cdn.rawgit.com/feross/standard/master/badge.svg)](https://github.com/feross/standard)

webpack 2.2.1

React React-Router Mobx AntDesign

> Note:  
Because this project using babel-preset-env, and the target is chrome 52, the transformed code will be es6 syntax.  
BUT [UglifyJsPlugin cannot optimize es6 code](https://webpack.js.org/plugins/uglifyjs-webpack-plugin/#install). So I changed optimize plugin to [babili](https://github.com/babel/babili).

## Still has some problem

[https://github.com/timoxley/standard-loader/pull/78](https://github.com/timoxley/standard-loader/pull/78)

[https://github.com/webpack/webpack/issues/4421](https://github.com/webpack/webpack/issues/4421)

> Warning:  
open-browser-webpack-plugin v0.0.4 has bug. It cause recompiling stucked.
Must ensure the version is locked to v0.0.3 to prevent the problem.
https://github.com/baldore/open-browser-webpack-plugin/issues/18

## Installation

```bash
yarn
```

## How to start

For development:
```bash
npm run dev
```

For production:
```bash
npm run build
```

Checkout the bundle-analyzer:
```bash
npm run build --analyse
```

# License

MIT [https://opensource.org/licenses/mit-license.php](https://opensource.org/licenses/mit-license.php)
