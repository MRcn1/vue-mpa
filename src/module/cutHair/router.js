import Vue from 'vue'
import Router from 'vue-router'
const codeOut = r => require.ensure([], () => r(require('./views/codeOut')),'codeOut');

Vue.use(Router)

const newRouter = new Router({
  routes:[
    {
      path:'/',
      component: codeOut,
      name: 'codeOut',
      meta: {
        title: '理发预约'
      }
    },
  ]
})

newRouter.beforeEach((route, redirect, next) => {
  document.title = route.meta.title || document.title;
  next();
});

export default newRouter
