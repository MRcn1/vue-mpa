'use strict'
const path = require('path')
const glob = require('glob')
const utils = require('./utils')
const entrys = require('../config/entrys')

/*多应用基础目录路径*/
const appBaseEntryPath = './src/module/';
/*自定要打包的子应用入口*/
let appEntryPaths = entrys.devEntrys;

/*获得批量入口配置*/
module.exports = {
  basePath:appBaseEntryPath,
  appEntryPaths:appEntryPaths,
  /**
   * 根据 appEntryPaths 获取入口文件列表
   * @param extensions {string} -选填 获取哪种类型的入口文件，默认：.js
   * @param globEntry {string} -选填 glob匹配的入口地址，默认不用填
   * @returns {*} 返回入口地址列表
   */
  getEntry:function (extensions,globEntry) {

    let globPath = '';
    let ext = extensions || '.js';
    if(globEntry){
      globPath = globEntry+ext;
    }else {
      /*根据 appEntryPaths 生产入口路径 以提供给glob进行匹配*/
      globPath = appBaseEntryPath;
      if(appEntryPaths.length === 1){
        globPath = globPath + appEntryPaths[0] + '/*'+ext;
      }else if(appEntryPaths.length > 1){
        globPath = globPath + '{' + appEntryPaths.join(',') +'}/*'+ext;
      }else {
        console.error('must provide an entrance path');
        return false;
      }
    }

    let entries = {}, basename, tmp, pathname ,globResult ,matchResult = [];

    /*提取匹配的路径*/
    globResult = glob.sync(globPath);

    globResult.forEach(function (val) {
      let fileName = path.basename(val,path.extname(val));
      /*为了尽可能兼容不规则入口，此处需作特殊处理*/
      if( path.dirname(val).toLowerCase().includes(fileName.toLowerCase()) ){
        matchResult.push(val);
      }
    });

    matchResult.forEach(function (entry) {
      basename = path.basename(entry, path.extname(entry));
      tmp = entry.split('/').splice(-3);
      /*正确输出js和html的路径*/
      pathname = tmp.splice(0, 1) + '/' + basename;
      entries[pathname] = entry;
    });

    return entries;
  },
  /**
   * 自动获取基础应用入口，排除超级子应用
   * 目前要排除的是crm、form，后面会根据实际情况添加
   * */
  getBaseEntry:function (extensions) {
    let t = this,
      entries = t.getAllEntry(extensions),
      /*排除列表*/
      excludeList = [
        'crm',
        'form',
        'demo'
      ];

    /*循环删除*/
    excludeList.forEach(function (val) {
      delete entries['module/'+val];
    })

    return entries;
  },
  /*自动获取所有相关入口点*/
  getAllEntry:function (extensions) {
    let t = this;
    return t.getEntry(extensions,t.basePath+'*/*');
  },
  /**
   * 自动判断当前需要使用的入口
   * @param extensions {string} -可选，对应的扩展名,默认：.js
   * @returns {*}
   */
  smartEntry:function (extensions) {
    let t = this,
      entrys,
      ext = extensions || '.js';

    let buildCode = utils.getBuildCode();
    if(buildCode){
      switch (buildCode) {
        case 'all' :
          /*自动获取所有入口*/
          entrys = t.getAllEntry(ext);
          break;
        case 'base' :
          /*自动获取基础应用入口*/
          entrys = t.getBaseEntry(ext);
          break;
        default :
          /*获取指定的入口*/
          entrys = t.getEntry(ext,t.basePath+buildCode+'/*');
          break;
      }
    }else {
      entrys = t.getEntry(ext);
    }

    return entrys;
  }
}

