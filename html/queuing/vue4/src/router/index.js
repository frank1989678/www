import Vue from 'vue'
import Router from 'vue-router'
import App from './App.vue';
import page1 from './components/page1.vue';
import page2 from './components/page2.vue';

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/index',
      component: index
    }, {
      path: '/',
      component: HelloWorld
    }
  ]
})
