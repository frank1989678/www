import Vue from 'vue'
import Router from 'vue-router'

import Setting from '@/pages/setting'
import Integrity from '@/pages/integrity'
import Order from '@/pages/order'
import OrderSet from '@/pages/orderSet'

Vue.use(Router)

export default new Router({
	routes: [
		{
			path: '/', name: 'Setting', component: Setting
		},
		{
			path: '/setting', name: 'Setting', component: Setting
		},
		{
			path: '/integrity', name: 'Integrity', component: Integrity
		},
		{
			path: '/order', name: 'Order', component: Order
		},
		{
			path: '/orderSet', name: 'OrderSet', component: OrderSet
		}
	]
})