// pages/a/orderList/orderList.js
const _lib = require('../../../lib/lib.js');
Page({
	data: {
		list: [
			{'key':'1','tag': '官方', 'name': '客服消息', 'msg': '恭喜您，陪玩师——王者荣耀认证成功！', 'avatar': '../../../images/service.png', 'unread': 0},
			{'key':'2','tag': '', 'name': '小医仙', 'msg': '小医仙会撒娇承包服务贴心，全能为，可凶可怂你...', 'avatar': 'http://localhost/wallpaper/avatar/07.png', 'unread': 2}
		]
	},
	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function(options) {
	}
})