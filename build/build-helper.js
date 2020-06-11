process.on('message', (msg) => {
  console.log('接收到父进程的消息' + msg);
});

const path = require('path')
const shell = require('shelljs')
const buildCore = require('./build-core')
const utils = require('./utils')

let main = {
  exit: function () {
    /*预留点后续处理时间，然后退出*/
    setTimeout(function () {
      process.exit();
    }, 1000 * 1.5);
  },
  /**
   * 自动安装依赖包
   * @param cwd {path} -必选 指定运行环境
   * @param timeout {number} -可选 指定超时时间，默认5分钟（1000*60*5）
   * @returns {Promise<any>}
   */
  autoInstallPackage: function (cwd, timeout) {
    return new Promise(function (resolve, reject) {
      /*TODO 后续需改成yarn包管理*/
      // let command = 'npm run bootstrap';
      let command = 'cnpm i';
      shell.exec(command, {
        silent: true,
        cwd: cwd || path.resolve(__dirname, '../'),
        timeout: timeout || 1000 * 60 * 5
      }, function (code, stdout, stderr) {
        if (code) {
          reject(stderr);
        } else {
          resolve(stdout);
        }
      });
    });
  },
  build: async function () {
    let t = this;

    await t.autoInstallPackage().catch(err => {
      console.error('依赖包安装失败~');
    })

    /*确保不传参的时候也能正常打包全部应用*/
    let buildCode = utils.getBuildCode();
    if (!buildCode) {
      process.argv.push('--build-all');
    }

    let builder = buildCore.buildHelper();
    builder.then(function (stats) {
      process.send({
        error: false,
        msg: "打包成功~"
      })
      t.exit();
    }).catch(function (err) {
      process.send({
        error: true,
        msg: "打包失败~"
      })
      t.exit();
    });
  },
  init: function () {
    let t = this;
    t.build();
  }
}

main.init();
