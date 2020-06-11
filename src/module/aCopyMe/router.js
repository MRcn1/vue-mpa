import Vue from 'vue'
import Router from 'vue-router'
const helloWorld = r => require.ensure([], () => r(require('./views/helloWorld')),'helloWorld');

Vue.use(Router)

const newRouter = new Router({
  routes:[
    {
      path:'/',
      component: helloWorld,
      name: 'helloWorld',
      meta: {
        title: 'helloWorld'
      }
    },
  ]
})

newRouter.beforeEach((route, redirect, next) => {
  document.title = route.meta.title || document.title;
  next();
});

export default newRouter
