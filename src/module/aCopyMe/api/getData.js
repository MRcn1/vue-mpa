import { post, fetch, patch, put } from '../../../assets/js/http'
/***
 * @param url 接口地址
 * @param data 参数
 * @param loading 是否显示加载样式，默认true
 * @param msg 是否显示接口返回的msg，默认true
 */

const API = data => fetch('/djy-digital/dsf/gfs/uploadFile', data)

export {
    API,
}