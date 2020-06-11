'use strict'
const utils = require('./utils')
const webpack = require('webpack')
const config = require('../config')
const appEntry = require('./webpack.entrys')
const htmlTemplates = require('./html-template-factory')
const merge = require('webpack-merge')
const path = require('path')
const baseWebpackConfig = require('./webpack.base.conf')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const MiniCssTextPlugin = require('mini-css-extract-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin')
const portfinder = require('portfinder')

const HOST = process.env.HOST
const PORT = process.env.PORT && Number(process.env.PORT)

/*跟基础配置信息进行合并，组合出开发环境的配置信息*/
const devWebpackConfig = merge(baseWebpackConfig, {
  mode: 'development',
  module: {
    rules: utils.styleLoaders({
      hotReload: true,
      extract: true,
      sourceMap: config.dev.cssSourceMap,
      usePostCSS: true
    })
  },
  // cheap-module-eval-source-map is faster for development
  devtool: config.dev.devtool,

  // these devServer options should be customized in /config/index.js
  devServer: {
    clientLogLevel: 'warning', //none，error，warning

    /*使用 HTML5 History API*/
    /*
    historyApiFallback: {
      rewrites: [
        { from: /.*!/, to: path.posix.join(config.dev.assetsPublicPath, 'index.html') },
      ],
    },
    */

    hot: true,
    /*contentBase: [path.join(__dirname, 'public'), path.join(__dirname, 'assets')]*/
    /*since we use CopyWebpackPlugin.*/
    contentBase: false,
    /*启用Gzip压缩 启用后编译速度会明显变慢*/
    compress: false,
    host: HOST || config.dev.host,
    port: PORT || config.dev.port,
    open: config.dev.autoOpenBrowser,
    /*打开页面*/
    openPage: config.dev.url,
    /*跨域服务器名单*/
    allowedHosts: [
      'do1.net.cn',
      'tqy.do1.net.cn',
      'do1.com.cn',
      'tqy.do1.com.cn',
      'qy.do1.com.cn'
    ],
    /*启用https协议 因为测试环境和线上环境都是https协议，必须对应才能进行热更新*/
    https: config.dev.useHttps || false,
    /*编译错误时在浏览器中显示错误信息*/
    overlay: config.dev.errorOverlay
      ? {warnings: false, errors: true}
      : false,
    publicPath: config.dev.assetsPublicPath,
    /*惰性模式 将不监视文件改动，不想使用自动刷新功能时可设置为true*/
    lazy: false,
    /*代理设置*/
    proxy: config.dev.proxyTable,
    /*静默模式，减少不必要的信息输出 necessary for FriendlyErrorsPlugin*/
    quiet: true,
    watchOptions: {
      poll: config.dev.poll,
    },
    before:config.dev.before || function (app) {},
    after:config.dev.after || function (app) {}
  },
  plugins: [

    new webpack.DefinePlugin({
      'process.env': require('../config/dev.env')
    }),

    /*使用热替换插件*/
    new webpack.HotModuleReplacementPlugin(),

    new MiniCssTextPlugin({
      filename: utils.assetsPath('[name].css')
    }),

    /*
    // 当前多入口不必包含该一级页面
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: 'index.html',
      inject: true
    }),
    */

    // copy custom static assets
    new CopyWebpackPlugin([
      {
        from: path.resolve(__dirname, '../static'),
        to: config.dev.assetsSubDirectory,
        ignore: ['.*']
      }
    ])
  ]
})

/*统一给HTML模板注入内容*/
if(config.dev.setInjectContent instanceof Function){
  htmlTemplates.setInjectContent = config.dev.setInjectContent;
}

/*配置HtmlWebpackPlugin*/
let htmlWebpackPluginConf = htmlTemplates.extractHtmlWebpackPluginConf(devWebpackConfig.entry);
htmlWebpackPluginConf.forEach(function (conf) {
  devWebpackConfig.plugins.push(new HtmlWebpackPlugin(conf));
});

/*默认打开第一被匹配到的应用入口*/
if (appEntry.appEntryPaths.length >= 1) {
  let templatePages = htmlTemplates.getTemplatePages(),
    templatePagesPath = Object.values(templatePages)[0],
    openPageUrl = 'vp/module/' + path.basename(templatePagesPath);
  devWebpackConfig.devServer.openPage = openPageUrl;
}

module.exports = new Promise((resolve, reject) => {
  portfinder.basePort = process.env.PORT || config.dev.port
  portfinder.getPort((err, port) => {
    if (err) {
      reject(err)
    } else {
      // console.log(devWebpackConfig.module.rules)
      // publish the new Port, necessary for e2e tests
      process.env.PORT = port
      // add port to devServer config
      devWebpackConfig.devServer.port = port;

      let serverConf = devWebpackConfig.devServer,
        host = serverConf.host,
        protocol = serverConf.https ? 'https':'http';

      if(host === '0.0.0.0'){
        host = "localhost";
      }

      let successMessages = [`Your application is running here: ${protocol}://${host}:${port}`];

      /*增加可用的访问入口提示*/
      let templatePages = htmlTemplates.getTemplatePages();
      if(templatePages){
        successMessages.push('The page entry you might want to visit:');
        Object.values(templatePages).forEach(function (pagesPath) {
          let pagesName = path.basename(pagesPath),
            url = `${protocol}://${host}:${port}/vp/module/${pagesName}`;
          successMessages.push(url)
        })
      }

      // Add FriendlyErrorsPlugin
      devWebpackConfig.plugins.push(new FriendlyErrorsPlugin({
        compilationSuccessInfo: {
          messages: successMessages,
        },
        onErrors: config.dev.notifyOnErrors
          ? utils.createNotifierCallback()
          : undefined
      }))

      resolve(devWebpackConfig)
    }
  })
});
