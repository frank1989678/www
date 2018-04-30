// pages/a/order/order.js
const _api = require('../../../lib/api.js');
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
			{
				'catName': '王者荣耀',
				'list': [
					{'online':0, 'url': '../../../images/ico/3.jpg','sex': 2,'tag':'萝莉','price':'72.00','unit':'小时','city':'武汉','nickname':'frank'},
					{'online':1, 'url': '../../../images/ico/2.jpg','sex': 1,'tag':'鲜肉','price':'72.00','unit':'小时','city':'武汉','nickname':'自在'},
					{'online':1, 'url': '../../../images/ico/3.jpg','sex': 1,'tag':'鲜肉','price':'72.00','unit':'小时','city':'武汉','nickname':'自在'}
				]
			}
		],

		pageNum: 1,
		pageSize: 20
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
		// this.getCategory();
		// this.getList();
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