import Vue from 'vue'
import Router from 'vue-router'

import Home from '@/pages/Home.vue'

import Login from '@/pages/Login'

import User from '@/pages/user/list.vue'

import Admin from '@/pages/admin/list.vue'

import Category from '@/pages/category/list.vue'
import CategoryAdd from '@/pages/category/add.vue'

import Tag from '@/pages/tag/list.vue'
import TagAdd from '@/pages/tag/add.vue'

import Order from '@/pages/order/list.vue'

import Verity from '@/pages/verity/list.vue'
import VerityAdd from '@/pages/verity/add.vue'

import Skill from '@/pages/skill/list.vue'
import SkillAdd from '@/pages/skill/add.vue'

import Wallet from '@/pages/wallet/list.vue'
import WalletRemit from '@/pages/wallet/remit.vue'

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
            iconCls: 'icon icon-user',//图标样式class
            children: [
                { path: '/user/list', component: User, name: '用户列表' },
                { path: '/admin/list', component: Admin, name: '管理员列表' }
            ]
        },
        {
            path: '/',
            component: Home,
            name: '陪玩管理',
            iconCls: 'icon icon-star',//图标样式class
            children: [
                { path: '/category/list', component: Category, name: '内容管理' },
                { path: '/category/list/add', component: CategoryAdd, name: '内容编辑', hidden: true },
                { path: '/tag/list', component: Tag, name: '标签组管理' },
                { path: '/tag/list/add', component: TagAdd, name: '标签组编辑', hidden: true },
                { path: '/verity/list', component: Verity, name: '陪玩师管理' },
                { path: '/verity/list/add', component: VerityAdd, name: '打手认证信息', hidden: true },
                { path: '/skill/list', component: Skill, name: '技能管理' },
                { path: '/skill/list/add', component: SkillAdd, name: '技能编辑', hidden: true }
            ]
        },
        {
            path: '/',
            component: Home,
            name: '订单管理',
            iconCls: 'icon icon-order',//图标样式class
            children: [
                { path: '/order/list', component: Order, name: '订单列表' }
            ]
        },
        {
            path: '/',
            component: Home,
            name: '零钱管理',
            iconCls: 'icon icon-wallet',//图标样式class
            children: [
                { path: '/wallet/list', component: Wallet, name: '提现管理' },
                { path: '/wallet/remit', component: WalletRemit, name: '加零钱' }
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
