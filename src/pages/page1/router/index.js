import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

const newRouter = new Router({
    routes: [{
        path: '/',
        component: r => require.ensure([], () => r(require('../views/wen')), 'wen'),
        name: 'wen',
        meta: {
            title: 'wen'
        }
    }, {
        path: '/chen',
        component: r => require.ensure([], () => r(require('../views/chen')), 'chen'),
        name: 'chen',
        meta: {
            title: 'chen'
        }
    }, ]
})
newRouter.beforeEach((route, redirect, next) => {
    document.title = route.meta.title || document.title;
    next();
});
export default newRouter