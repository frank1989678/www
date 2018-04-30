// pages/a/order/order.js
const _lib = require('../../../lib/lib.js');
Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		list1: [
			{'name': '所有技能','key': '0'},
			{'name': '王者荣耀','key': '1'},
			{'name': '绝地求生','key': '2'},
			{'name': '英雄联盟','key': '3'},
			{'name': '穿越火线','key': '4'},
			{'name': '吃鸡战场','key': '5'}
		],
		name1: '所有技能',hidden1: false,
		list2: [
			{'name': '全部状态','key': '0'},
			{'name': '陪玩成功','key': '1'},
			{'name': '交易关闭','key': '2'}
		],
		name2: '全部状态',
		hidden2: false,
		list: [
			{'id':'12345678912','datetime':'18-04-19 18:47:30','name': '绝地求生',"status": "等待陪玩",'key': '1','icon': 'http://localhost/wallpaper/avatar/01.png','price': 14,'unit': '元', 'type': 1},
			{'id':'12345678912','datetime':'18-04-19 18:47:30','name': '王者荣耀',"status": "陪玩中",'key': '2','icon': 'http://localhost/wallpaper/avatar/02.png','price': 14,'unit': '小时', 'type': 1, 'pay': true}
		]
	},

	showSelect: function(e) {
		var key = e.target.dataset.key || '';
		var name = e.target.dataset.name;
		var val = e.target.dataset.val;
		if (key.indexOf('hidden') > -1) {
			this.setData({
				hidden1: false,
				hidden2: false,
				[key]: true
			})
		}

		if (name) {
			this.setData({
				hidden1: false,
				hidden2: false,
				[name]: val
			})
		}
	},

	bindPickerChange: function(e) {
		console.log(e)
	},

	// 加载更多
	loadMore: function() {
		const para = {
			id: this.data.id,
			page: this.data.page
		}
		_lib.ajax('url', para, function(res) {
			// this.list.push(res.list)
			if (res.code === '') {

			}
		}, 
		function(err) {

		})
	},

	// lazyload
	lazyload: function() {

	},

	// 详情页
	goPage: function() {
		wx.reLaunch({
			url: '/pages/login/login'
		})
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function(options) {

	},

	/**
	 * 生命周期函数--监听页面初次渲染完成
	 */
	onReady: function() {

	},

	/**
	 * 生命周期函数--监听页面显示
	 */
	onShow: function() {

	},

	/**
	 * 生命周期函数--监听页面隐藏
	 */
	onHide: function() {

	},

	/**
	 * 生命周期函数--监听页面卸载
	 */
	onUnload: function() {

	},

	/**
	 * 页面相关事件处理函数--监听用户下拉动作
	 */
	onPullDownRefresh: function() {

	},

	/**
	 * 页面上拉触底事件的处理函数
	 */
	onReachBottom: function() {

	},

	/**
	 * 用户点击右上角分享
	 */
	onShareAppMessage: function() {

	}
})