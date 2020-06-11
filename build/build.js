const fs = require("fs-extra")
const path = require('path')
const config = require('../config')
const utils = require('./utils')
const buildCore = require('./build-core')
const dirMap = require('../config/publish.dir.map')
const notifier = require('node-notifier')

let main = {
  /*消息通知*/
  notify:function(msg){
    let opt = {
      title: 'Build：',
      message: msg || '请输入提示内容',
      sound: true,
      wait:false
    };
    notifier.notify(opt);
  },
  init: function () {
    let t = this,
      builder = buildCore.build(false, true);

    builder.then(function (stats) {
      let buildCode = utils.getBuildCode(),
        outputOpt = stats.compilation.outputOptions,
        pubPath = dirMap[buildCode];

      if (pubPath) {
        /*移动分发到对应的发布目录*/
        fs.remove(pubPath).then(() => {
          fs.move(outputOpt.path, pubPath, {overwrite: true});
          console.log('已打包发布到：' + pubPath);
        }).catch((err) => {
          console.error(err);
        });
      } else {
        console.log('已打包发布到临时目录：' + outputOpt.path);
      }

      t.notify('打包成功');
    }).catch(function (err) {
      t.notify('打包失败，请检查原因~');
      console.error('运行报错：');
      console.log(err);
    });
  }
}

main.init();
