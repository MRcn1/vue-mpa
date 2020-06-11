import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'
import Vant from 'vant';
import 'vant/lib/index.css';

Vue.use(Vant);

new Vue({
    el: '#app',
    router,
    store,
    template: '<App/>',
    components: { App }
});