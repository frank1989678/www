//引入并安装vue-router插件
import Vue from 'vue';
import axios from 'axios';
Vue.prototype.$axios = axios;
require('./mock.js');
import VueRouter from 'vue-router';
Vue.use(VueRouter);
import page1 from './components/page1.vue';
import page2 from './components/page2.vue';
import page3 from './components/page3.vue';
import page4 from './components/page4.vue';
import page5 from './components/page5.vue';
import page6 from './components/page6.vue';
import page7 from './components/page7.vue';
import page8 from './components/page8.vue';
import page9 from './components/page9.vue';
//定义路由
const routes = [
    { path: '/', component: page1 },
    { path: '/page1', component: page1, name: 'page1'},
    { path: '/page2', component: page2, name: 'page2'},
    { path: '/page3', component: page3, name: 'page3'},
    { path: '/page4', component: page4, name: 'page4'},
    { path: '/page5', component: page5, name: 'page5'},
    { path: '/page6', component: page6, name: 'page6'},
    { path: '/page7', component: page7, name: 'page7'},
    { path: '/page8', component: page8, name: 'page8'},
    { path: '/page9', component: page9, name: 'page9'}
]
const router = new VueRouter({
  routes
});

new Vue({
  el: '#app',
  router
});

