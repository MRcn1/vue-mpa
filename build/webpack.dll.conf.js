'use strict'
const path = require('path')
const utils = require('./utils')
const webpack = require('webpack')
const config = require('../config')
const appEntry = require('./webpack.entrys')
const merge = require('webpack-merge')
const baseWebpackConfig = require('./webpack.base.conf')

// const webpackConfig = merge(baseWebpackConfig, {})
module.exports = {
  entry:{
    vendor:[
      'axios',
      'better-scroll',
      'vue',
      'vue-i18n',
      'vue-infinite-scroll',
      'vue-router',
      'vue-touch',
      'vuedraggable',
      'vuex',
      'weixin-js-sdk'
    ],
    /*vux 有BUG，待解决*/
    // vuxdll:['vux']
  },
  output:{
    path: path.resolve(__dirname, '../dist'),
    filename: utils.assetsPath('[name].dll.js')
  },
  module: {
    rules: utils.styleLoaders({
      sourceMap: config.build.productionSourceMap,
      extract: true,
      // usePostCSS: true
    })
  },
  plugins: [
    new webpack.DllPlugin({
      name: '[name]_[hash]',
      path: path.join(__dirname, '[name]-manifest.json')
    })
  ]
} ;
