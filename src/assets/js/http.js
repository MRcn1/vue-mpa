import axios from 'axios'
import qs from 'qs'
import { Dialog, Toast } from 'vant';

axios.defaults.timeout = 5000;
axios.defaults.baseURL = '/djysit/api';
axios.defaults.headers = {
    "Content-Type": 'application/json'
}

// var taost = null

//http request 拦截器
axios.interceptors.request.use(
    config => {
        config.headers = {
            "Content-Type": 'application/x-www-form-urlencoded; charset=UTF-8'
        }
        config.data = qs.stringify(config.data)
        return config;
    },
    error => {
        return Promise.reject(err);
    }
);

//http response 拦截器
axios.interceptors.response.use(
    response => {
        return response;
    },
    error => {
        return Promise.reject(error)
    }
)

/**
 * 封装get方法
 * @param url
 * @param data
 * @returns {Promise}
 */

export function fetch(url, params = {}, loading = true, msg = true) {
    return new Promise((resolve, reject) => {
        var toast = null
        if (loading) {
            toast = Toast.loading({
                duration: 0, // 持续展示 toast
                forbidClick: true,
                message: '加载中...',
            });
        }
        axios.get(url, {
                params: params,
            })
            .then(response => {
                if (msg && response.data.code != 0) { //是否显示提示框
                    Dialog.alert({
                        title: '提示',
                        message: response.data.msg,
                        overlay: false
                    })
                }
                toast ? toast.clear() : ''; //关闭加载框
                resolve(response.data);
            })
            .catch(err => {
                reject(err)
            })
    })
}


/**
 * 封装post请求
 * @param url
 * @param data
 * @returns {Promise}
 */

export function post(url, data = {}, loading = true, msg = true) {
    return new Promise((resolve, reject) => {
        var toast = null
        if (loading) {
            toast = Toast.loading({
                duration: 0, // 持续展示 toast
                forbidClick: true,
                message: '加载中...',
            });
        }
        axios.post(url, data)
            .then(response => {
                if (msg && response.data.code != 0) { //是否显示提示框
                    Dialog.alert({
                        title: '提示',
                        message: response.data.msg,
                        overlay: false
                    })
                }
                toast ? toast.clear() : ''; //关闭加载框
                resolve(response.data);
            }, err => {
                reject(err)
            })
    })
}

/**
 * 封装patch请求
 * @param url
 * @param data
 * @returns {Promise}
 */

export function patch(url, data = {}, loading = true, msg = true) {
    return new Promise((resolve, reject) => {
        var toast = null
        if (loading) {
            toast = Toast.loading({
                duration: 0, // 持续展示 toast
                forbidClick: true,
                message: '加载中...',
            });
        }
        axios.patch(url, data)
            .then(response => {
                if (msg && response.data.code != 0) { //是否显示提示框
                    Dialog.alert({
                        title: '提示',
                        message: response.data.msg,
                        overlay: false
                    })
                }
                toast ? toast.clear() : ''; //关闭加载框
                resolve(response.data);
            }, err => {
                reject(err)
            })
    })
}

/**
 * 封装put请求
 * @param url
 * @param data
 * @returns {Promise}
 */

export function put(url, data = {}, loading = true, msg = true) {
    return new Promise((resolve, reject) => {
        var toast = null
        if (loading) {
            toast = Toast.loading({
                duration: 0, // 持续展示 toast
                forbidClick: true,
                message: '加载中...',
            });
        }
        axios.put(url, data)
            .then(response => {
                if (msg && response.data.code != 0) { //是否显示提示框
                    Dialog.alert({
                        title: '提示',
                        message: response.data.msg,
                        overlay: false
                    })
                }
                toast ? toast.clear() : ''; //关闭加载框
                resolve(response.data);
            }, err => {
                reject(err)
            })
    })
}