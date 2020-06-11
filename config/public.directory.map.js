/**
 * 发布目录映射，用于单独发布超级子应用到某个指定目录
 */

const path = require('path')
const config = require('./index')

let basePath = path.resolve(__dirname, '../../../wxqyh/src/main/webapp'),
  map = {
    'all': config.build.assetsRoot,
    'base': config.build.assetsRoot,
    'crm': path.join(basePath,'/vp_crm'),
    'form': path.join(basePath,'/vp_from'),
    'buildTest': path.resolve(__dirname,'../dist')
  };

module.exports = map;

