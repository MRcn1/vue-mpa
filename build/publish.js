const path = require('path')
const fs = require("fs-extra")
const glob = require('glob')

const main = {
  publishPath: path.resolve(__dirname, '../dist/publish'),
  packPath: path.resolve(__dirname, '../../../qwy-pack'),

  /*删除旧数据*/
  delOldPackFiles: function () {
    const t = this,
      globResult = glob.sync('*/', {cwd: t.publishPath})

    globResult.forEach(function (globDir) {
      fs.removeSync(path.join(t.packPath, globDir))
    })
  },

  /*将dist/publish下面的文件分发到qwy-pack目录下面*/
  dispatchToPack: function () {
    const t = this;
    t.delOldPackFiles();
    fs.copySync(t.publishPath, t.packPath);

    console.log('新的打包文件已发布到qwy-pack目录下：');
    console.log(t.packPath);
  },
  init: function () {
    const t = this;
    t.dispatchToPack();
  }
}
main.init();
