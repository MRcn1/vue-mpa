const childProcess = require('child_process')
const utils = {
  openUrl: function(url) {
    let cmd = 'start',
      platform = process.platform
    switch (platform) {
      case 'wind32':
        cmd = 'start'
        break
      case 'linux':
        cmd = 'xdg-open'
        break
      case 'darwin':
        cmd = 'open'
        break
    }
    childProcess.exec(`${cmd} ${url}`)
  }
}

/*自定义开发配置*/
module.exports = {
  /*开发环境配置*/
  dev: {
    /*设置要注入到HTML模板下的内容，增强开发调试能力*/
    setInjectContent: function($template) {
      let injectContent = `
      <script>
        window._debugToolsConfig_ = {
          /*开发模式下不需要收集相关数据，所以可以禁止代理console下面的方法*/
          consoleProxy:false,
          /*打开vconsole*/
          vconsole:false
        }
      </script>
      <script src="../static/js/common/qwGuard.js"></script>`

      let $title = $template('head title'),
        $dom = $title[0] ? $title : $template('head')
      $dom.after(injectContent)

      return $template
    },

    /*如果想让Fiddler代理开发也支持热更新，请填写自己本地的ip，并且使用https*/
    host: '0.0.0.0',
    port: 8089,
    useHttps: false,
    errorOverlay: true,
    notifyOnErrors: true,

    /*启用代码检查*/
    useEslint: false,

    /*自动打开浏览器url（已失效）请转到entrys.js配置你要开发的入口*/
    url: 'vp/module/learnonline.html',
    autoOpenBrowser: false,

    /*如果你一定要打开页面，请使用下面这个方法*/
    after: function(app) {
      // let url = 'https://tqy.do1.net.cn/dev-wxqyh/manager/loginweb.jsp';
      // utils.openUrl(url);
    }
  },

  /*生产环境配置 如果要打包发布，务必使该配置跟默认配置一致，否则一切后果自负*/
  build: {
    /*是否压缩HTML模板页*/
    // minifyHtmlTemplate:false,
    /*生成SourceMap文件*/
    // productionSourceMap:true
  }
}
