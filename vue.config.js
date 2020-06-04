let pageMethod = require('./util/getPages.js');
pages = pageMethod.pages();
module.exports = {
    pages,
    lintOnSave:false,
    publicPath: process.env.NODE_ENV === 'production'
    ? '/dist/'
    : '/',
}