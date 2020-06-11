/**
 * html模板文件加工工厂
 * 本模块主要负责提取html模板和注入公共代码
 */
'use strict'
const fs = require('fs');
const path = require('path');
const cheerio = require('cheerio');
const config = require('../config');
const appEntry = require('./webpack.entrys');

const main = {
  /*存储模板页对象*/
  templatePages:null,
  /**
   * 获取模板文件
   * @returns {*|string}
   */
  getTemplatePages: function () {
    let t = this;
    if(t.templatePages){
      return t.templatePages;
    }else {
      t.templatePages = appEntry.smartEntry('.html');
      return t.templatePages;
    }
  },
  /**
   * 设置需要注入的内容 后面可以通过重写这个方法来注入自己想要的内容
   * @param $template {templateDom} -必选，html模板的dom对象，
   * 重写setInjectContent方法的时候可以通过操纵类似操纵jq对象的形式来注入内容
   * 注意，注入完后一定要把$template重新返回，才能确保被正确读取
   * @returns {*} 返回 $template
   */
  setInjectContent:function($template){
    /*
    // 这是重写示例
    let injectContent = `
      <script>
        console.info('你可以通过重写 setInjectContent 方法来注入自己想要的内容哟~');
      </script>
    `;
    $template('head title').after(injectContent);
    return $template;
    */
    return $template;
  },
  /**
   * 获取HTML模板内容，并注入一些公共代码
   * @param templatePagesUrl
   */
  getTemplateContent:function(templatePagesPath){
    let t = this,
      filePath = path.resolve(templatePagesPath),
      htmlTemplate = '';

    /*读取默认模板*/
    try {
      htmlTemplate = fs.readFileSync(filePath);
    } catch (e) {
      console.error('读取HTML模板时出错，请检查：'+filePath+' 下面是否有对应的文件');
      throw e;
    }

    /*注入公共内容*/
    let $ = cheerio.load(htmlTemplate.toString()),
      templateContent = t.setInjectContent($,filePath) || $;
    if(typeof templateContent !== 'string' && templateContent['html']){
      templateContent = templateContent.html();
    }else {
      // 返回结果错误则使用默认模板内容
      templateContent = htmlTemplate ;
    }

    return templateContent;
  },
  /**
   * 提取 HtmlWebpackPlugin 配置数据
   * @param entry {object} -必选，webpack的入口配置，因为需要进行对比
   * @returns {Array}
   */
  extractHtmlWebpackPluginConf: function (entry) {
    let t = this,
      templatePages = t.getTemplatePages(),
      htmlWebpackPluginConf = [];

    /*html文件模板配置 HtmlWebpackPlugin*/
    for (let fileName in templatePages) {

      /*基本配置*/
      let conf = {
        filename: fileName + '.html',
        /*模板路径*/
        template: templatePages[fileName],
        templateContent:function(){
          return t.getTemplateContent(templatePages[fileName]);
        },
        inject: true,
        chunksSortMode: 'dependency'
      };

      /*判断是否需要压缩HTML模板*/
      let isMinify = process.env.NODE_ENV === 'production'?config.build.minifyHtmlTemplate:config.dev.minifyHtmlTemplate;
      if(isMinify === true){
        conf.minify = {
          removeComments: false,
          collapseWhitespace: true,
          removeAttributeQuotes: true
        }
      }

      if (fileName in entry) {
        conf.chunks = ['common','manifest', 'vendor', fileName];
        conf.hash = false;
      }

      htmlWebpackPluginConf.push(conf);
    }

    return htmlWebpackPluginConf;
  }
}

module.exports = main;


