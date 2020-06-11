'use strict'
const fs = require('fs-extra')
const path = require('path')
const dayjs = require('dayjs')
const os = require('os')

const userConfigDirectory = path.join(
    os.homedir(),
    '/.webpack.custom.conf/wap/'
)

let config = {
    /*开发环境配置*/
    dev: {
        assetsSubDirectory: 'static',
        assetsPublicPath: '/vp/',
        /*自动打开浏览器url（已失效）请转到entrys.js配置你要开发的入口*/
        proxyTable: {
            '/djysit/api': {
                target: 'http://106.52.178.41:8888',
                changeOrigin: true,
                // pathRewrite: {
                //     '^/djysit/api': ''
                // }
            }
        },
        /*是否压缩HTML模板页*/
        minifyHtmlTemplate: false,
        /*设置要注入到HTML模板下的内容，增强开发调试能力*/
        setInjectContent: function ($template) {
            let timestamp = new Date().getTime(),
                injectContent = `
      <script>
        /*统一增加开发环境运行标识，后续可以根据这个变量判断是否处于开发环境*/
        window._isDevEnv_ = true;
        
        window._debugToolsConfig_ = {
          /*自动加载vconsole*/
          vconsole:false
        }
      </script>
      <script src="../static/js/common/qwGuard.js?t=${timestamp}"></script>`

            let $title = $template('head title'),
                $dom = $title[0] ? $title : $template('head')
            $dom.after(injectContent)

            /*增加打包时间注释，方便查看版本更新情况*/
            let Time = dayjs().format('YYYY-MM-DD HH:mm:ss'),
                packageInfo = `\n<!-- build at : ${Time} -->`
            $template('html').after(packageInfo)

            return $template
        },

        /*服务器相关配置项*/
        host: 'localhost',
        port: 8089,
        useHttps: false,
        autoOpenBrowser: true,
        errorOverlay: true,
        notifyOnErrors: false,

        /*devServer.watchOptions.poll*/
        poll: false,

        /*启用代码检查*/
        useEslint: false,
        /*在浏览器中覆盖显示错误提示*/
        showEslintErrorsInOverlay: false,

        /*Source Maps devtool*/
        devtool: 'cheap-module-eval-source-map',

        // If you have problems debugging vue-files in devtools,
        // set this to false - it *may* help
        // https://vue-loader.vuejs.org/en/options.html#cachebusting
        cacheBusting: true,
        cssSourceMap: true
    },
    /*生产环境配置*/
    build: {
        /*默认html模板，我们是多应用配置，此配置对我们项目无效*/
        index: path.resolve(__dirname, '../index.html'),
        /*发布路径*/
        assetsRoot: path.resolve(__dirname, '../dist/publish'),
        assetsSubDirectory: 'static',
        assetsPublicPath: '../',
        /*生产环境下是否生产SourceMap*/
        productionSourceMap: false,
        // https://webpack.js.org/configuration/devtool/#production
        devtool: '#source-map',
        // Gzip off by default as many popular static hosts such as
        // Surge or Netlify already gzip all static assets for you.
        // Before setting to `true`, make sure to:
        // npm install --save-dev compression-webpack-plugin
        productionGzip: true,
        productionGzipExtensions: ['html', 'js', 'css'],
        // Run the build command with an extra argument to
        // View the bundle analyzer report after build finishes:
        // `npm run build --report`
        // Set to `true` or `false` to always turn it on or off
        // 是否展示webpack构建打包之后的分析报告
        bundleAnalyzerReport: process.env.npm_config_report,

        /*是否压缩HTML模板页*/
        minifyHtmlTemplate: true,
        /*设置要注入到HTML模板下的内容，例如统一给生产环境注入异常监控脚本*/
        setInjectContent: function ($template) {
            let timestamp = new Date().getTime(),
                Time = dayjs().format('YYYY-MM-DD HH:mm:ss'),
                injectContent = `
      <script>
        window._publicTime_ = "${Time}";
      </script>
      <script src="../static/js/common/qwGuard.js?t=${timestamp}"></script>`

            let $title = $template('head title'),
                $dom = $title[0] ? $title : $template('head')
            $dom.after(injectContent)

            /*增加打包时间注释，方便查看版本更新情况*/
            let packageInfo = `\n<!-- build at : ${Time} -->`
            $template('html').after(packageInfo)

            return $template
        }
    },

    /*用户自定义配置，用于减少修改当前配置造成的误提交*/
    userConfig: {
        /*用户开发配置目录，多应用*/
        userDirectory: userConfigDirectory,
        configDirectory: path.join(userConfigDirectory, '/config/'),
        logDirectory: path.join(userConfigDirectory, '/log/')
    }
}

/*合并自定义配置到默认配置*/
function mergeConfig() {
    let configDir = config.userConfig.configDirectory,
        configFile = path.join(configDir, 'index.js'),
        hasConfigFile = fs.existsSync(configFile),
        // 自用的自定义配置，放在config目录下的custom.config目录下，除非已对该目录进行版本排除，否则强烈不建议在该目录下放置自定义配置
        // 此处支持自用的自定义配置的原因是：如果已对该目录进行版本排除，放在该目录下方便编辑修改
        selfUseConfigFile = path.resolve(__dirname, './custom.config/index.js')
    if (hasConfigFile || fs.existsSync(selfUseConfigFile)) {
        try {
            let userConfig = hasConfigFile ?
                require(configFile) :
                require(selfUseConfigFile)

            /**
             * 合并配置
             * 此处不要使用 webpack-merge 进行配置合并
             * 因为 webpack-merge 会导致函数方法被先执行,然后返回执行值，
             * 最终会导致 setInjectContent 配置运行错误
             */
            for (var key in userConfig) {
                var confItemObj = userConfig[key]
                if (config[key]) {
                    Object.assign(config[key], confItemObj)
                }
            }

            console.log(
                '已加载自定义配置文件：',
                hasConfigFile ? configFile : selfUseConfigFile
            )
        } catch (err) {
            console.error(err)
            return false
        }
    } else {
        console.log('如果需要进行个性化配置，请使用自定义的index.js文件进行配置')
        console.error('自定义配置目录：' + configDir)
    }
}

mergeConfig()

module.exports = config