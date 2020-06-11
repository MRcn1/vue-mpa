# qwy

> A Vue.js project

## Build Setup

``` bash
# install dependencies
npm install

# serve with hot reload at localhost:8089
npm run dev

# build for production with minification
npm run build

# build for production and view the bundle analyzer report
npm run build --report
```

For detailed explanation on how things work, checkout the [guide](http://vuejs-templates.github.io/webpack/) and [docs for vue-loader](http://vuejs.github.io/vue-loader).


此为多页面应用模板

在src/module下创建一个应用模块，模块名应与模块下的index.html,main,js一致

例如 模块名叫‘bibi’,则模块下的，‘index.html’叫‘bibi.html’，‘main.js’叫‘bibi.js’

创建好模块后，在config/custom.config/entrys.js 指定当前要开发的模块入口配置

重现启动项目