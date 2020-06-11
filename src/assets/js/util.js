import Vue from 'vue'

/**
 * @desc 拥有的工具类
 * 复制对象
 * 复制数组
 * 获取区间随机数
 * 获取url路径
 * 获取url路径中某个参数
 * 判断两个数组是否相等
 * 获取浏览器类型和版本
 * JS日期格式化转换方法
 * 是否为PC端
 * 删除数组中一个元素
 * 去除空格
 * 将阿拉伯数字翻译成中文的大写数字
 * 获取十六进制随机颜色
 * 判断字符串是否为空
 */

/**
 * @desc 复制对象
 * @param odlObj 对象
 */
Vue.prototype.$copyObj = function (odlObj) {
    var newobj = {};
    for (var attr in odlObj) {
        newobj[attr] = odlObj[attr];
    }
    return newobj;
};

/**
 * @desc 复制数组
 * @param odlArray 数组
 */
Vue.prototype.$copyArray = function (odlArray) {
    var newArray = [];
    for (var i = 0; i < odlArray.length; i++) {
        var obj = odlArray[i];
        newArray.push(obj);
    }
    return newArray;
};

/**
 * @desc 获取区间随机数 
 * @param min 最小值
 * @param max 最大值
 */
Vue.prototype.$randomNum = function (min, max) {
    return Math.floor(min + Math.random() * (max - min));
};

/**
 * @desc 获取url路径
 */
Vue.prototype.$getRootPath = function () {
    /* 获取完整URL */
    var href = window.document.location.href;
    /* 获取文件路径（文件地址） */
    var pathname = window.location.pathname;
    /* 获取协议 */
    var protocol = window.location.protocol
    /* 获取主机地址和端口号 */
    var host = window.location.host
    /* 获取主机地址 */
    var hostname = window.location.hostname
    /* 获取端口号 */
    var port = window.location.port
    /* 获取锚点（“#”后面的分段） */
    var hash = window.location.hash
    /* 获取属性（“?”后面的分段） */
    var search = window.location.search
    /* 获取协议+域名+端口 */
    var origin = window.location.origin

    return {
        href,
        pathname,
        protocol,
        host,
        hostname,
        port,
        hash,
        search,
        origin
    };
};

/**
 * @desc 获取访问路径中某个参数
 * @param paramName 参数名
 * @param url 指定要截取参数的url（可以为空，如果为空url指向当前页面）
 */
Vue.prototype.$getParamter = function (paramName, url) {
    var seachUrl = window.location.search.replace("?", "");
    if (url != null) {
        var index = url.indexOf('?');
        url = url.substr(index + 1);
        seachUrl = url;
    }
    var ss = seachUrl.split("&");
    var paramNameStr = "";
    var paramNameIndex = -1;
    for (var i = 0; i < ss.length; i++) {
        paramNameIndex = ss[i].indexOf("=");
        paramNameStr = ss[i].substring(0, paramNameIndex);
        if (paramNameStr == paramName) {
            var returnValue = ss[i].substring(paramNameIndex + 1, ss[i].length);
            if (typeof (returnValue) == "undefined") {
                returnValue = "";
            }
            return returnValue;
        }
    }
    return "";
}

/**
 * 
 * @desc 判断两个数组是否相等
 * @param {Array} arr1 
 * @param {Array} arr2 
 * <a href='http://www.jobbole.com/members/wx1409399284'>@return</a> {Boolean}
 */
Vue.prototype.$arrayEqual = function (arr1, arr2) {
    if (arr1 === arr2) return true;
    if (arr1.length != arr2.length) return false;
    for (var i = 0; i < arr1.length; ++i) {
        if (arr1[i] !== arr2[i]) return false;
    }
    return true;
}

/**
 * 
 * @desc 数组去重
 * @param {Array} arr
 */
Vue.prototype.$removeDupthird = function (arr) {
    var newArr = [];
    var obj = {};
    for (var i = 0; i < arr.length; i++) {
        obj[arr[i]] = arr[i];
    }
    var list = [];
    for (var i in obj) {
        list.push(i);
    }
    return list;
};

/**
 * 
 * @desc 获取浏览器类型和版本
 */
Vue.prototype.$getExplore = function () {
    var sys = {},
        ua = navigator.userAgent.toLowerCase(),
        s;
    (s = ua.match(/rv:([\d.]+)\) like gecko/)) ? sys.ie = s[1]:
        (s = ua.match(/msie ([\d\.]+)/)) ? sys.ie = s[1] :
        (s = ua.match(/edge\/([\d\.]+)/)) ? sys.edge = s[1] :
        (s = ua.match(/firefox\/([\d\.]+)/)) ? sys.firefox = s[1] :
        (s = ua.match(/(?:opera|opr).([\d\.]+)/)) ? sys.opera = s[1] :
        (s = ua.match(/chrome\/([\d\.]+)/)) ? sys.chrome = s[1] :
        (s = ua.match(/version\/([\d\.]+).*safari/)) ? sys.safari = s[1] : 0;
    // 根据关系进行判断
    if (sys.ie) return ('IE: ' + sys.ie)
    if (sys.edge) return ('EDGE: ' + sys.edge)
    if (sys.firefox) return ('Firefox: ' + sys.firefox)
    if (sys.chrome) return ('Chrome: ' + sys.chrome)
    if (sys.opera) return ('Opera: ' + sys.opera)
    if (sys.safari) return ('Safari: ' + sys.safari)
    return 'Unkonwn'
}


/**
 * @desc JS日期格式化转换方法
 * @param fmt 日期时间的格式 如：yyyy-MM-dd hh:mm:ss，yyyy年MM月dd日
 * @param date 日期时间 如：2012/12/25 20:11:11，1402233166999，不传则默认当前时间
 * 
 */
Vue.prototype.$dateFormat = function (fmt, date) {
    if (date) {
        date = new Date(date)
    } else {
        date = new Date()
    }
    var o = {
        "M+": date.getMonth() + 1, //月份 
        "d+": date.getDate(), //日 
        "h+": date.getHours(), //小时 
        "m+": date.getMinutes(), //分 
        "s+": date.getSeconds(), //秒 
        "q+": Math.floor((date.getMonth() + 3) / 3), //季度 
        "S": date.getMilliseconds() //毫秒 
    };
    if (/(y+)/.test(fmt)) {
        fmt = fmt.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
    }
    for (var k in o) {
        if (new RegExp("(" + k + ")").test(fmt)) {
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
        }
    }
    return fmt;
}


/**
 * @desc //是否为PC端
 * 
 */
Vue.prototype.$isPC = function () {
    var userAgentInfo = navigator.userAgent;
    var Agents = ["Android", "iPhone",
        "SymbianOS", "Windows Phone",
        "iPad", "iPod"
    ];
    var flag = true;
    for (var v = 0; v < Agents.length; v++) {
        if (userAgentInfo.indexOf(Agents[v]) > 0) {
            flag = false;
            break;
        }
    }
    return flag;
}


/**
 * @desc 正则验证
 * @param str 需要验证的内容
 * @param type 验证类型
 * 
 */
Vue.prototype.$checkStr = function (str, type) {
    switch (type) {
        case 'phone': //手机号码
            return /^1[3|4|5|7|8][0-9]{9}$/.test(str);
        case 'tel': //座机
            return /^(0\d{2,3}-\d{7,8})(-\d{1,4})?$/.test(str);
        case 'card': //身份证
            return /^\d{15}|\d{18}$/.test(str);
        case 'pwd': //密码以字母开头，长度在6~18之间，只能包含字母、数字和下划线
            return /^[a-zA-Z]\w{5,17}$/.test(str)
        case 'postal': //邮政编码
            return /[1-9]\d{5}(?!\d)/.test(str);
        case 'QQ': //QQ号
            return /^[1-9][0-9]{4,9}$/.test(str);
        case 'email': //邮箱
            return /^[\w-]+(\.[\w-]+)*@[\w-]+(\.[\w-]+)+$/.test(str);
        case 'money': //金额(小数点2位)
            return /^\d*(?:\.\d{0,2})?$/.test(str);
        case 'URL': //网址
            return /(http|ftp|https):\/\/[\w\-_]+(\.[\w\-_]+)+([\w\-\.,@?^=%&:/~\+#]*[\w\-\@?^=%&/~\+#])?/.test(str)
        case 'IP': //IP
            return /((?:(?:25[0-5]|2[0-4]\\d|[01]?\\d?\\d)\\.){3}(?:25[0-5]|2[0-4]\\d|[01]?\\d?\\d))/.test(str);
        case 'date': //日期时间
            return /^(\d{4})\-(\d{2})\-(\d{2}) (\d{2})(?:\:\d{2}|:(\d{2}):(\d{2}))$/.test(str) || /^(\d{4})\-(\d{2})\-(\d{2})$/.test(str)
        case 'number': //数字
            return /^[0-9]$/.test(str);
        case 'english': //英文
            return /^[a-zA-Z]+$/.test(str);
        case 'chinese': //中文
            return /^[\u4E00-\u9FA5]+$/.test(str);
        case 'lower': //小写
            return /^[a-z]+$/.test(str);
        case 'upper': //大写
            return /^[A-Z]+$/.test(str);
        case 'HTML': //HTML标记
            return /<("[^"]*"|'[^']*'|[^'">])*>/.test(str);
        default:
            return true;
    }
}


/**
 * @desc 删除数组中一个元素
 * @param arr   指定数组
 * @param ele   要删除的元素
 */
Vue.prototype.$arrRemove = function (arr, ele) {
    var index = arr.indexOf(ele);
    if (index > -1) {
        arr.splice(index, 1);
    }
    return arr;
}

/**
 * @desc 去除空格
 * @param type: 1-所有空格 2-前后空格 3-前空格 4-后空格
 */
Vue.prototype.$trim = function (str, type) {
    type = type || 1
    switch (type) {
        case 1:
            return str.replace(/\s+/g, "");
        case 2:
            return str.replace(/(^\s*)|(\s*$)/g, "");
        case 3:
            return str.replace(/(^\s*)/g, "");
        case 4:
            return str.replace(/(\s*$)/g, "");
        default:
            return str;
    }
}

/**
 * @desc 将阿拉伯数字翻译成中文的大写数字
 * @param num
 */
Vue.prototype.$numberToChinese = function (num) {
    var AA = new Array("零", "一", "二", "三", "四", "五", "六", "七", "八", "九", "十");
    var BB = new Array("", "十", "百", "仟", "萬", "億", "点", "");
    var a = ("" + num).replace(/(^0*)/g, "").split("."),
        k = 0,
        re = "";
    for (var i = a[0].length - 1; i >= 0; i--) {
        switch (k) {
            case 0:
                re = BB[7] + re;
                break;
            case 4:
                if (!new RegExp("0{4}//d{" + (a[0].length - i - 1) + "}$")
                    .test(a[0]))
                    re = BB[4] + re;
                break;
            case 8:
                re = BB[5] + re;
                BB[7] = BB[5];
                k = 0;
                break;
        }
        if (k % 4 == 2 && a[0].charAt(i + 2) != 0 && a[0].charAt(i + 1) == 0)
            re = AA[0] + re;
        if (a[0].charAt(i) != 0)
            re = AA[a[0].charAt(i)] + BB[k % 4] + re;
        k++;
    }

    if (a.length > 1) // 加上小数部分(如果有小数部分)
    {
        re += BB[6];
        for (var i = 0; i < a[1].length; i++)
            re += AA[a[1].charAt(i)];
    }
    if (re == '一十')
        re = "十";
    if (re.match(/^一/) && re.length == 3)
        re = re.replace("一", "");
    return re;
}

/**
 * @desc 获取十六进制随机颜色
 */
Vue.prototype.$getRandomColor = function (num) {
    return '#' + (function (h) {
        return new Array(7 - h.length).join("0") + h;
    })((Math.random() * 0x1000000 << 0).toString(16));
}


/**
 * @desc 判断字符串是否为空
 * @param str 传入的字符串
 */
Vue.prototype.$strIsEmpty = function (str) {
    if (str != null && str.length > 0) {
        return false;
    } else {
        return true;
    }
}
