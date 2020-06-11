/*!
 *  qwGuard bese on AlloyLever
 *  AlloyLever Github: https://github.com/AlloyTeam/AlloyLever
 *  MIT Licensed.
 */
;(function (root, factory) {
  if (typeof exports === 'object' && typeof module === 'object')
    module.exports = factory()
  else if (typeof define === 'function' && define.amd)
    define([], factory)
  else if (typeof exports === 'object')
    exports["qwGuard"] = factory()
  else
    root["qwGuard"] = factory()
})(window, function () {
  var qwGuard = {}

  /*默认配置*/
  qwGuard.settings = {
    cdn: '//res.wx.qq.com/mmbizwap/zh_CN/htmledition/js/vconsole/3.0.0/vconsole.min.js',
    reportUrl: null,
    reportPrefix: '',
    reportKey: 'msg',
    otherReport: null,
    entry: null
  }

  /*数据存储*/
  qwGuard.store = []

  /*劫持console下的相关方法，实现调用监听*/
  var methodList = ['log', 'info', 'warn', 'debug', 'error'];
  methodList.forEach(function (item) {
    var method = console[item];

    console[item] = function () {
      qwGuard.store.push({
        logType: item,
        logs: arguments
      });

      method.apply(console, arguments);
    }
  });

  /*进行初始化配置*/
  qwGuard.config = function (config) {
    for (var i in config) {
      if (config.hasOwnProperty(i)) {
        qwGuard.settings[i] = config[i]
      }
    }

    if (config.entry) {
      window.addEventListener('load', function () {
        qwGuard.entry(config.entry)
      })
    }

    var parameter = getParameter('vconsole')

    if (parameter) {
      if (parameter === 'show') {
        qwGuard.vConsole(true)
      } else {
        qwGuard.vConsole(false)
      }
    }
  }

  /*控制vConsole的显隐*/
  qwGuard.vConsole = function (show) {

    loadScript(qwGuard.settings.cdn, function () {
      //support vconsole3.0
      if (typeof vConsole === 'undefined') {
        window.vConsole = new VConsole({
          defaultPlugins: ['system', 'network', 'element', 'storage'],
          maxLogNumber: 5000
        })
      }

      var i = 0,
        len = qwGuard.store.length

      for (; i < len; i++) {
        var item = qwGuard.store[i]
        //console[item.type].apply(console, item.logs)
        //prevent twice log
        item.noOrigin = true
        window.vConsole.pluginList.default.printLog(item)

        /*TODO 待优化 输出之前的记录信息，到 VConsole*/
        var logType = item.logType;
        if(logType && console[logType]){
          console[logType]('qwGuard store message:',item);
        }
      }

      if (show) {
        try {
          window.vConsole.show()
        } catch (e) {
        }

        window.addEventListener('load', function () {
          window.vConsole.show()
        })
      }
    })
  }

  /*根据URL参数判断是否需要打开vconsole*/
  var parameter = getParameter('vconsole')
  if (parameter) {
    if (parameter === 'show') {
      qwGuard.vConsole(true)
    } else {
      qwGuard.vConsole(false)
    }
  }

  /**
   * 配置调试开关
   * @param selector {string} -必选 开关按钮选择器
   * @param openCount {number} -可选 点击多少次后打开，默认5次
   * @param timeout {number} -可选 规定时间内点够 openCount 次才能正常打开，否则超时了，要重新点击才行， 默认 1000*10 ms
   */
  qwGuard.entry = function (selector,openCount,timeout) {
    var count = 0,
      timer = null,
      entry = document.querySelector(selector)
    if (entry) {
      entry.addEventListener('click', function () {
        count++
        if (count > openCount || 5) {
          count = -100000;
          qwGuard.vConsole(true)
        }

        /*超时重置*/
        if(!timer){
          timer = setTimeout(function () {
            timer = null;
            count = 0;
          }, timeout || 1000 * 10);
        }
      })
    }
  }

  /**
   * 节律编辑器
   * @param rhythm {array} -必选 节律数组，例如[800,800,-3000]
   * 节律时间取正值表示在这个时间范围内的都将继续响应，取负数表示需超过这个时间范围才能继续响应，处于这个时间范围内的将表示放弃响应
   * @param selector {string} -必选 响应点击节律的选择器,一般使用id选择器
   * @param callback {function} -可选 成功通过节律控制的回调操作
   */
  qwGuard.rhythmEditor = function rhythmEditor(rhythm,selector,callback){
    var clicker = document.querySelector(selector);

    callback = callback || function () {
      // console.log('恭喜你通过了节律限定，可以执行某些操作了');
    }

    if(!clicker || clicker._rhythmEditor_){
      return false;
    }

    clicker._rhythmEditor_ = true;

    var count = 0,
      len = rhythm.length,
      timer = null,
      lock = false;

    /*重置节律器，所有都将重新计算*/
    function resetRhythmEditor(noTips){
      if(!noTips){
        // console.log('节律响应失败，请重新操作',count,rhythm[count]);
      }
      count = 0;
      lock = false;
      clearTimeout(timer);
    }

    clicker.addEventListener('click', function () {

      var delayed = rhythm[count];
      clearTimeout(timer);

      if(!delayed){
        resetRhythmEditor();
        // console.error('节律时间不应该包含0');
        return false;
      }

      /*处于锁定状态还继续点击，则将视为放弃所有操作*/
      if(lock){
        resetRhythmEditor();
        return false;
      }

      if(delayed > 0){
        timer = setTimeout(function () {
          if(count >= len){
            callback && callback();
          }
          resetRhythmEditor();
        }, Math.abs(delayed));
      }else if(delayed < 0){
        lock = true;
        timer = setTimeout(function () {
          lock = false;
          if(count >= len){
            callback && callback();
            resetRhythmEditor(true);
          }
        }, Math.abs(delayed));
      }

      count++;
    })

  }

  /**
   * 初始化 qwGuard
   * @param defaultRhythm {boolean} - 可选，初始化一个默认节律来响应加载调试工具，默认false
   */
  qwGuard.init = function(defaultRhythm){

    /*根据页面全局变量自动加载*/
    var debugConf = window._debugToolsConfig_
    if(debugConf && debugConf.vconsole){
      qwGuard.vConsole();
    }

    if(defaultRhythm){
      /*添加默认响应节律*/
      setTimeout(function () {
        /*三重奏三次 [800,800,-3000,800,800,-3000,800,800,-2000]*/
        /*四重奏二次 [800,800,800,-3000,800,800,800,-2000]*/
        var rootDomSelecter = 'body';
        /**
         * TODO 待优化
         * ios中不允许将点击事件绑定在document或者body上，
         * 如果绑定上的话将会导致失效（文字区域又不会失效）
         * 所以单页应用上检测有没有 app id
         */
        if(document.getElementById('app')){
          rootDomSelecter = '#app';
        }

        qwGuard.rhythmEditor([800,800,800,-3000,800,800,800,-2000],rootDomSelecter,function () {
          qwGuard.vConsole(true);
        });
      }, 1000 * 3);
    }
  }

  /*错误日志记录*/
  qwGuard.logs = []

  /*全局错误信息监听*/
  window.addEventListener('error', function (msg, url, line, col, error) {

    var newMsg = msg

    if (error && error.stack) {
      newMsg = processStackMsg(error)
    }

    if (isOBJByType(newMsg, "Event")) {
      newMsg += newMsg.type ?
        ("--" + newMsg.type + "--" + (newMsg.target ?
          (newMsg.target.tagName + "::" + newMsg.target.src) : "")) : ""
    }

    newMsg = (newMsg + "" || "").substr(0, 500)

    qwGuard.logs.push({
      msg: newMsg,
      target: url,
      rowNum: line,
      colNum: col,
      errorMsg:msg
    })

    if (msg.toLowerCase && msg.toLowerCase().indexOf('script error') > -1) {
      console.error('Script Error: See Browser Console for Detail')
    } else {
      console.error(msg)
    }

    var ss = qwGuard.settings
    if (ss.reportUrl) {
      var src = ss.reportUrl + (ss.reportUrl.indexOf('?') > -1 ? '&' : '?') + ss.reportKey + '=' + (ss.reportPrefix ? ('[' + ss.reportPrefix + ']') : '') + newMsg + '&t=' + new Date().getTime()
      if (ss.otherReport) {
        for (var i in ss.otherReport) {
          if (ss.otherReport.hasOwnProperty(i)) {
            src += '&' + i + '=' + ss.otherReport[i]
          }
        }
      }
      new Image().src = src
    }

    return true;
  });


  /**
   * 动态加载脚本文件
   * @param src {string} -必选 脚本文件地址
   * @param callback {function} -必选 加载成功的回调函数
   */
  function loadScript(src, callback) {
    var s,
      r,
      t
    r = false
    s = document.createElement('script')
    s.type = 'text/javascript'
    s.src = src

    s.onload = s.onreadystatechange = function () {
      //console.log( this.readyState ); //uncomment this line to see which ready states are called.
      if (!r && (!this.readyState || this.readyState == 'complete')) {
        r = true
        callback()
      }
    }

    t = document.getElementsByTagName('script')[0]
    t.parentNode.insertBefore(s, t)
  }

  /*获取链接后面的控制参数*/
  function getParameter(n) {
    var m = window.location.hash.match(new RegExp('(?:#|&)' + n + '=([^&]*)(&|$)')),
      result = !m ? '' : decodeURIComponent(m[1])
    return result || getParameterByName(n)
  }

  /*根据名称获取对应参数*/
  function getParameterByName(name, url) {
    if (!url) url = window.location.href
    name = name.replace(/[\[\]]/g, "\\$&")
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
      results = regex.exec(url)
    if (!results) return null
    if (!results[2]) return ''
    return decodeURIComponent(results[2].replace(/\+/g, " "))
  }

  /*判断是否为对象*/
  function isOBJByType(o, type) {
    return Object.prototype.toString.call(o) === "[object " + (type || "Object") + "]"
  }

  /*处理错误信息提示*/
  function processStackMsg(error) {
    var stack = error.stack
    .replace(/\n/gi, "")
    .splitreportUrl(/\bat\b/)
    .slice(0, 9)
    .join("@")
    .replace(/\?[^:]+/gi, "")
    var msg = error.toString()
    if (stack.indexOf(msg) < 0) {
      stack = msg + "@" + stack
    }
    return stack
  }

  /*获取cookie信息*/
  function getCookie(name) {
    var arr, reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)")

    if (arr = document.cookie.match(reg))
      return unescape(arr[2])
    else
      return null
  }

  qwGuard.getCookie = getCookie
  qwGuard.getParameter = getParameter
  qwGuard.loadScript = loadScript

  return qwGuard
});

/*本次不上正式运行环境，故加此判断*/
if(!/\/wxqyh\/vp/.test(window.location.href)){
  /*自动初始化 qwGuard*/
  qwGuard.init(true);
}


/**
 * 发布的时候请对该文件进行压缩和加密
 * 在线压缩和加密工具：https://tool.css-js.com/
 * 先点击Uglify压缩，再点JSPacker加密
 */
