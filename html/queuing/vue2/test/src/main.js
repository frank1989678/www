// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
// import router from './router'
import Router from 'vue-router'
Vue.use(Router)

import index from './components/index.vue';
import hello from './components/hello.vue'

const routers = [
    {path: '/', components: App},
    {path: '/index', components: index},
    {path: '/hello', components: hello}
]

const router = new Router({
    routers
});

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router
})
