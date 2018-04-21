import Vue from 'vue'
import Router from 'vue-router'

import Home from '@/pages/Home.vue'

import Login from '@/pages/Login'

import User from '@/pages/user/UserList.vue'
import Admin from '@/pages/user/AdminList.vue'

import gameList from '@/pages/player/GameList.vue'
import gameTag from '@/pages/player/GameTag.vue'
import gamerInfo from '@/pages/player/GamerInfo.vue'
import gamerSkill from '@/pages/player/GamerSkill.vue'


Vue.use(Router)

const router = new Router({
    routes: [
        {
            path: '/login', name: 'Login', component: Login, hidden: true
        },
        {
            path: '/',
            component: Home,
            name: '用户管理',
            iconCls: 'el-icon-message',//图标样式class
            children: [
                { path: '/user/list', component: User, name: '用户列表' },
                { path: '/user/admin', component: Admin, name: '管理员列表' }
            ]
        },
        {
            path: '/',
            component: Home,
            name: '陪玩管理',
            iconCls: 'el-icon-message',//图标样式class
            children: [
                { path: '/player/list', component: gameList, name: '内容管理' },
                { path: '/player/tag', component: gameTag, name: '标签组管理' },
                { path: '/player/info', component: gamerInfo, name: '打手信息审核' },
                { path: '/player/skill', component: gamerSkill, name: '打手技能审核' }
            ]
        }
    ]
});

router.beforeEach((to, from, next) => {
    if (to.path == '/login') {
        Cookies.remove('token');
    }
    let user = Cookies.get('token');
    
    if (!user && to.path != '/login') {
        next({
            path: '/login'
        })
    } else {
        next()
    }
})

export default router;
