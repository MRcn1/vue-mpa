/**
 * 指定当前要开发的子应用入口配置，加快开发热更新效率
 * 实现按需加载
 */

const fs = require('fs-extra')
const path = require('path')
const config = require('./index')

let entrys = {
  devEntrys: [
    'cutHair' 
  ]
}

/*替换自定义开发入口到默认入口*/
function replaceEntrys() {
  let configDir = config.userConfig.configDirectory,
    entrysFile = path.join(configDir, 'entrys.js'),
    hasEntrysFile = fs.existsSync(entrysFile),
    // 自用的自定义配置，放在config目录下的custom.config目录下，除非已对该目录进行版本排除，否则强烈不建议在该目录下放置自定义配置
    // 此处支持自用的自定义配置的原因是：如果已对该目录进行版本排除，放在该目录下方便编辑修改
    selfUseEntrysFile = path.resolve(__dirname, './custom.config/entrys.js')
  if (hasEntrysFile || fs.existsSync(selfUseEntrysFile)) {
    try {
      let userEntrys = hasEntrysFile
        ? require(entrysFile)
        : require(selfUseEntrysFile)
      entrys.devEntrys = userEntrys.devEntrys || entrys.devEntrys
      console.log(
        '已加载自定义配置文件：',
        hasEntrysFile ? entrysFile : selfUseEntrysFile
      )
    } catch (err) {
      console.error(err)
      return false
    }
  } else {
    console.error('为加快热更新速度，请配置自定义entrys.js文件')
    console.error('自定义配置目录：' + configDir)
  }
}

replaceEntrys()

module.exports = entrys
