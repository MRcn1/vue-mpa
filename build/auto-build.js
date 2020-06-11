
const shell = require('shelljs')
const buildCore = require('./build-core')

let main = {
  init:function () {

    buildCore.logSetting({
      fileNamePrefix:'auto_build_wap_log_',
    });

    buildCore.filesWatching();
    
    /*进入utf8编码，解决中文乱码*/
    shell.exec('CHCP 65001',{silent:true});

    if(buildCore.isAllowAutoRun()){
      buildCore.gitPull();
      let installState = buildCore.autoInstallPackage();
      installState.then(function () {
        buildCore.goToAutoBuild();
      }).catch(function () {
        /*循环通知运行报错，因为单次通知可能会错过*/
        setInterval(function () {
          buildCore.notify("依赖安装失败，请手动检查异常情况！");
        }, 1000 * 10);
      })
    }else {
      let errMsg = '未检测到git或cnpm命令，无法进行自动化打包';
      console.error(errMsg);
      buildCore.notify(errMsg);
    }
  }
}

main.init();
