'use strict'
const childProcess = require('child_process');
const path = require('path')
const config = require('../config')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const packageConfig = require('../package.json')
const fs = require("fs-extra")

module.exports = {
  assetsPath: function (_path) {
    const assetsSubDirectory = process.env.NODE_ENV === 'production'
      ? config.build.assetsSubDirectory
      : config.dev.assetsSubDirectory

    return path.posix.join(assetsSubDirectory, _path)
  },
  cssLoaders: function (options) {
    options = options || {}

    const cssLoader = {
      loader: 'css-loader',
      options: {
        sourceMap: options.sourceMap
      }
    }

    const postcssLoader = {
      loader: 'postcss-loader',
      options: {
        sourceMap: options.sourceMap
      }
    }

    // generate loader string to be used with extract text plugin
    function generateLoaders(loader, loaderOptions) {
      const loaders = options.usePostCSS ? [cssLoader, postcssLoader] : [cssLoader]

      if (loader) {
        loaders.push({
          loader: loader + '-loader',
          options: Object.assign({}, loaderOptions, {
            sourceMap: options.sourceMap
          })
        })
      }

      // Extract CSS when that option is specified
      // (which is the case during production build)
      if (options.extract) {
        loaders.unshift(MiniCssExtractPlugin.loader)
      } else {
        loaders.unshift('vue-style-loader')
      }

      if (options.hotReload) {
        return ['css-hot-loader'].concat(loaders);
      } else {
        return loaders;
      }
    }

    // https://vue-loader.vuejs.org/en/configurations/extract-css.html
    return {
      css: generateLoaders(),
      postcss: generateLoaders(),
      // less: generateLoaders('less'),
      sass: generateLoaders('sass', {indentedSyntax: true}),
      scss: generateLoaders('sass'),
      stylus: generateLoaders('stylus'),
      styl: generateLoaders('stylus')
    }
  },
  // Generate loaders for standalone style files (outside of .vue)
  styleLoaders: function (options) {
    const output = []
    const loaders = module.exports.cssLoaders(options)

    for (const extension in loaders) {
      const loader = loaders[extension]
      output.push({
        test: new RegExp('\\.' + extension + '$'),
        use: loader
      })
    }

    return output
  },
  createNotifierCallback: () => {
    const notifier = require('node-notifier')

    return (severity, errors) => {
      if (severity !== 'error') return

      const error = errors[0]
      const filename = error.file && error.file.split('!').pop()

      notifier.notify({
        title: packageConfig.name,
        message: severity + ': ' + error.name,
        subtitle: filename || '',
        icon: path.join(__dirname, 'logo.png')
      })
    }
  },

  /**
   * 获取打包时指定的打包命令
   */
  getBuildCode: function () {
    let t = this;

    if (t._buildCode_) {
      return t._buildCode_;
    }

    let buildCode = process.argv.find(function (value) {
      return /--build-/.test(value);
    });

    if (buildCode) {
      buildCode = buildCode.replace('--build-', '');
      t._buildCode_ = buildCode;
    }

    return buildCode;
  },
  /**
   * 进行用户自定义配置的初始化
   */
  initUserConfig: function () {
    let userConf = config.userConfig;
    try {
      fs.ensureDirSync(userConf.configDirectory);
      fs.ensureDirSync(userConf.logDirectory);
    } catch (e) {
      console.error('创建用户开发配置目录失败~');
      return true;
    }
  },
  /**
   * 打开某个指定的url
   * @param url {string} -必选 完整的url地址
   */
  openUrl: function (url) {
    let cmd = 'start',
      platform = process.platform;
    switch (platform) {
      case 'wind32' :
        cmd = 'start';
        break;
      case 'linux' :
        cmd = 'xdg-open';
        break;
      case 'darwin' :
        cmd = 'open';
        break;
    }
    childProcess.exec(`${cmd} ${url}`);
  }
}

/*确保基本目录和文件存在*/
module.exports.initUserConfig();
