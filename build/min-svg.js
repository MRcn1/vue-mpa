const path = require('path')
const fs = require("fs-extra")
const glob = require("fast-glob")
const SVGO = require("svgo")
const svgo = new SVGO();

const main = {
  /*对压缩前的svg文件进行备份*/
  copySvgToDist: () => new Promise(function (resolve, reject) {
    glob('../src/**/*.svg', {
      cwd: path.resolve(__dirname)
    }).then(function (filePaths) {

      fs.emptyDirSync(path.resolve(__dirname, '../dist/svg/'));

      filePaths.forEach(function (filePath) {
        let fileName = path.basename(filePath),
          relativePath = filePath.replace('../src/', ''),
          src = path.resolve(__dirname, filePath),
          dest = path.resolve(__dirname, '../dist/svg/' + relativePath);

        fs.copySync(src, dest, {
          overwrite: true
        })
      })
      console.log('一共找到：' + filePaths.length + '个svg文件');
      resolve(filePaths);
    }).catch(reject);
  }),
  /**
   * svg 压缩器
   * @param filePath {path} -必选 svg 文件路径
   * @returns {Promise<any>}
   */
  svgMinifier: function (filePath) {
    return new Promise(async function (resolve, reject) {
      let source = await fs.readFile(filePath, 'utf8').catch(function (err) {
        reject(err);
      });
      if (!source) {
        return false;
      }

      let result = await svgo.optimize(source, {path: filePath}).catch(function (err) {
        reject(err);
      });
      if (!result) {
        return false;
      }

      /*增加一些实用字段*/
      result.source = source;
      result.sourceByte = Buffer.byteLength(source);
      result.resultByte = Buffer.byteLength(result.data);
      result.minRatio = (result.sourceByte - result.resultByte) / result.sourceByte;

      resolve(result);
    });
  },

  /*压缩svg副本，仅用于测试*/
  minSvgCopy: async function () {
    let t = this;

    glob('../dist/svg/**/*.svg', {
      cwd: path.resolve(__dirname)
    }).then(async function (filePaths) {

      let minList = [],
        hasMinList = [],
        totalMinByte = 0;

      fs.emptyDirSync(path.resolve(__dirname, '../dist/svg.zip/'));

      filePaths.forEach(async function (filePath, index) {

        let fileName = path.basename(filePath),
          relativePath = filePath.replace('../dist/svg/', ''),
          src = path.resolve(__dirname, filePath),
          dest = path.resolve(__dirname, '../dist/svg.zip/' + relativePath);

        let result = await t.svgMinifier(src);

        /**
         * 由于已压缩过的文件，也会进行再次修改
         * 所以增加压缩率来判断要不要再次保存压缩结果
         * */
        if (result.minRatio > 0.05) {
          fs.outputFileSync(dest, result.data)
          minList.push(filePath)
          totalMinByte += (result.sourceByte - result.resultByte);
        } else {
          hasMinList.push(filePath)
        }

        /*END*/
        if (index >= filePaths.length - 1) {
          console.log('共发现：' + filePaths.length + '个svg文件');
          console.log('本次压缩了：' + minList.length + '个svg文件');
          console.log('已被压缩过的svg文件：' + hasMinList.length + '个');
          console.log('共节省了：' + totalMinByte + ' Byte');
        }

      })

    })
  },
  /**
   * 搜索src下面的所有svg文件，并对其进行压缩
   * 注意：该操作的压缩结果会直接替换掉源文件
   */
  minSvg: async function () {
    let t = this;
    glob('../src/**/*.svg', {
      cwd: path.resolve(__dirname)
    }).then(async function (filePaths) {

      let minList = [],
        hasMinList = [],
        totalMinByte = 0;

      filePaths.forEach(async function (filePath, index) {
        let fileName = path.basename(filePath),
          src = path.resolve(__dirname, filePath),
          dest = src;

        let result = await t.svgMinifier(src);

        /**
         * 由于已压缩过的文件，也会进行再次修改
         * 所以增加压缩率来判断要不要再次保存压缩结果
         * */
        if (result.minRatio > 0.05) {
          fs.outputFileSync(dest, result.data)
          minList.push(filePath)
          totalMinByte += (result.sourceByte - result.resultByte);
        } else {
          hasMinList.push(filePath)
        }

        /*END*/
        if (index >= filePaths.length - 1) {
          console.log('共发现：' + filePaths.length + '个svg文件');
          console.log('本次压缩了：' + minList.length + '个svg文件');
          console.log('已被压缩过的svg文件：' + hasMinList.length + '个');
          console.log('共节省了：' + totalMinByte + ' Byte');
        }

      })

    })
  },
  init: function () {
    let t = this;
    // t.copySvgToDist().then(function () {
    //   t.minSvgCopy();
    // })
    t.minSvg();
  }
}

main.init();
