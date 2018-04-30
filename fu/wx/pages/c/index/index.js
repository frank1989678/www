// pages/a/order/order.js
const _api = require('../../../lib/api.js');
const _lib = require('../../../lib/lib.js');
Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		imgUrls: [
			'../../../images/ico/1.jpg',
			'../../../images/ico/2.jpg',
			'../../../images/ico/3.jpg'
		],

		cat: [
			{'id':'1','name':'王者荣耀', 'icon':'../../../images/g1.png'},
			{'id':'2','name':'王者荣耀', 'icon':'../../../images/g2.png'},
			{'id':'3','name':'王者荣耀', 'icon':'../../../images/g3.png'},
			{'id':'4','name':'王者荣耀', 'icon':'../../../images/g4.png'},
			{'id':'5','name':'王者荣耀', 'icon':'../../../images/g5.png'},
			{'id':'6','name':'王者荣耀', 'icon':'../../../images/g6.png'},
			{'id':'7','name':'王者荣耀', 'icon':'../../../images/g7.png'},
			{'id':'8','name':'王者荣耀', 'icon':'../../../images/g8.png'}
		],

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

	// 加载更多
	loadMore: function() {
		const para = {
			id: this.data.id,
			page: this.data.page
		}
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

	// 全部游戏分类接口
	getCategory: function() {
		const that = this;
		_lib.ajax(_api.CATEGORY, {}, function(res) {
			console.log(res)
			if (res.data.status === 200) {
				that.setData({
					cat: res.data.data
				})
			}
		})
	},

	getList: function() {

		// _lib.ajax('/api/v1/category/all', )
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