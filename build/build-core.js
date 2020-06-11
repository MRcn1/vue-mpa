'use strict'
require('./check-versions')()

/*设置运行环境标识*/
process.env.NODE_ENV = 'production'

const ora = require('ora')
const path = require('path')
const chalk = require('chalk')
const webpack = require('webpack')
const config = require('../config')
const webpackConfig = require('./webpack.prod.conf')
const fs = require("fs-extra");
const shell = require('shelljs')
const notifier = require('node-notifier')
const utils = require('./utils')
const dirMap = require('../config/publish.dir.map')
const msgLog = require('./log')

msgLog.setting({
  fileNamePrefix: 'build_wap_log_',
  path: path.resolve(__dirname, '../dist/build_log')
});

let main = {
  /*消息通知*/
  notify: function (msg) {
    let opt = {
      title: 'autoBuild：',
      message: msg || '请输入提示内容',
      sound: true,
      wait: false
    };
    notifier.notify(opt);
  },
  gitCmd: function (cmd) {
    return shell.exec(cmd, {
      silent: true,
      cwd: path.resolve(__dirname, '../../')
    });
  },
  /*更新代码*/
  gitPull: function () {
    this.gitCmd('git pull');
  },
  /*获取最近git提交信息*/
  getGitLog: function () {
    let t = this;
    let gitLog = t.gitCmd('git log -3 --stat');
    t._curGitLog_ = gitLog;
    msgLog.log("最近git提交的相关信息：", 0, -1);
    msgLog.log('\n' + gitLog.stdout, 0, -1);
  },
  /*保存最近git提交信息到日志文件*/
  saveGitLog: function () {
    let t = this,
      gitLog = t._curGitLog_;
    if (gitLog) {
      msgLog.log("最近git提交的相关信息：", 0, -2);
      msgLog.saveLog(gitLog.stdout);
      msgLog.splitLine();
    }
  },
  /**
   * 打包后的日志记录函数
   * @param stats {object} -必选 打包后返回的统计信息
   */
  logRecorder: function (stats) {
    let compilation = stats.compilation;
    if (stats.hasErrors()) {
      msgLog.log(compilation.errors, -1);
    } else {
      let entrys = JSON.stringify(Object.keys(stats.compilation.options.entry)),
        time = (stats.endTime - stats.startTime) / 1000,
        buildInfo = 'Time: ' + time.toFixed(3) + 's ';

      let buildCode = utils.getBuildCode()
      if (buildCode) {
        entrys = '[build ' + buildCode + ']';
      }

      buildInfo += entrys + ' ';
      buildInfo += 'fileDependencies: ' + compilation.fileDependencies.size + ' ';
      buildInfo += 'modules: ' + compilation.modules.length + '\n';
      msgLog.log(buildInfo);
    }

    /*提示用户日志文件位置，方便查看*/
    console.log('  Build log info : ' + msgLog.getLogFilePath());
  },
  /**
   * 工程构建函数
   * @param silent {boolean} -可选，是否静默打包
   * @param tempDir {path|boolean} -可选，打包到临时目录，而不是直接输出到目标目录
   * @returns {Promise<any>}
   */
  build: function (silent, tempDir) {
    return new Promise((resolve, reject) => {

      if (tempDir) {
        if (typeof tempDir === 'string') {
          /*发布到指定的临时目录*/
          webpackConfig.output.path = tempDir;
        } else {
          /*发布到assetsRoot的同级.tempPublic目录下当前时间戳目录下*/
          tempDir = path.join(webpackConfig.output.path, '../.tempPublic/' + new Date().getTime())
          webpackConfig.output.path = tempDir;
        }
      }

      let buildCode = utils.getBuildCode()
      if (buildCode) {
        console.log(chalk.cyan('  Build ' + buildCode + ' app.\n'))
      } else {
        console.log(chalk.cyan('  Build alone.\n'))
      }

      const spinner = ora('building for production...');
      spinner.start();

      /*清空原来的打包数据然后进行打包*/
      fs.emptyDir(config.build.assetsRoot).then(() => {
        webpack(webpackConfig, (err, stats) => {
          spinner.stop()
          if (err) {
            reject(err);
            if (!silent) {
              throw err;
            }
            return false;
          }

          main.logRecorder(stats);

          if (stats.hasErrors()) {
            console.error('build hasErrors');
            reject(stats);
          } else {
            resolve(stats);
          }

          if (silent) {
            return true;
          }

          /*调整相关选项过滤日志输出*/
          process.stdout.write(stats.toString({
            assets: false,
            warnings: false,
            colors: true,
            modules: false,
            children: false,
            chunks: false,
            chunkModules: false
          }) + '\n\n')

          if (stats.hasErrors()) {
            console.log(chalk.red('  Build failed with errors.\n'))
            process.exit(1)
          }

          console.log(chalk.cyan('  Build complete.\n'))
          console.log(chalk.yellow(
            '  Tip: built files are meant to be served over an HTTP server.\n' +
            '  Opening index.html over file:// won\'t work.\n'
          ))
        })
      }).catch(err => {
        reject(err);
        if (!silent) {
          throw err;
        }
        return false;
      })
    });
  },
  /**
   * 打包助手 , 自动拉取git 更新，然后打包 并保存最近的git信息
   * @returns {Promise<any>}
   */
  buildHelper: function () {
    const t = this;
    return new Promise(function (resolve, reject) {

      function beforeBuild() {
        t.gitPull();
        /*打包前需先获取git log，否则会因为时间差影响log的准确性*/
        t.getGitLog();

        let packingTips = '正在进行自动打包操作，好紧张~';
        msgLog.log(packingTips, 0, -1);
        t.notify(packingTips);
      }

      function afterBuild(err, stats) {
        t.saveGitLog();
        if (err) {
          console.error(err);
          let errorTips = '自动打包失败！需等下次重新提交正常版本才能继续打包，你可通过查看日志文件了解更多信息~';
          msgLog.log(errorTips, -1, -1);
          t.notify(errorTips);
          reject(err);
          return false;
        } else {
          let sucTips = '打包成功，可以进行下一轮打包操作~';
          msgLog.log(sucTips, 0, -1);
          t.notify(sucTips);
          resolve(stats);
        }
      }

      beforeBuild();
      /*进行打包构建操作*/
      t.build(true, true).then(function (stats) {
        let buildCode = utils.getBuildCode(),
          outputOpt = stats.compilation.outputOptions,
          pubPath = dirMap[buildCode];

        if (pubPath) {
          /*移动分发到对应的发布目录*/
          fs.remove(pubPath).then(() => {
            fs.move(outputOpt.path, pubPath, {overwrite: true});
            console.log('已打包发布到：' + pubPath);
            afterBuild(null, stats);
          }).catch((err) => {
            afterBuild(err, null);
          });
        } else {
          console.log('已打包发布到临时目录：' + outputOpt.path);
          afterBuild(null, stats);
        }
      }).catch(function (err) {
        afterBuild(err, null);
      });
    });
  }
}
module.exports = main;
