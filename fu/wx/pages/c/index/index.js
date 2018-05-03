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

		cat: [],

		list: {},

		pageNum: 1,
		pageSize: 4
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
	getAllProduct: function() {
		const that = this;
		_lib.ajax(_api.category, {}, function(res) {
			if (res.status === 200) {
				let cat = res.data;
				let list = that.data.list;
				for (let i in cat) {
					const para = {
						catName: cat[i].name,
						categoryId: cat[i].id,
						list: [],
						pageSize: 4,
						pageNum: 1,
						nomore: true
					}
					list[cat[i].id] = para;
				}
				that.setData({
					cat: cat,
					list: list
				})
				that.getAllCatGame();
			}
		})
	},
	getAllCatGame: function() {
		const list = this.data.list;

		for (let i in list) {
			this.getCatGame( i);
		}
	},
	getCatGame: function(i) {
		const that = this;
		const list = this.data.list;
		const para = {
			categoryId: list[i].categoryId,
			pageSize: list[i].pageSize,
			pageNum: list[i].pageNum
		}
		_lib.ajax(_api.catGames, para, function(res) {
			if (res.status === 200) {
				let list = that.data.list;
				let item = list[i];
				item.pageNum = para.pageNum + 1;
				item.nomore = res.data.hasNextPage;
				item.list = item.list.concat(res.data.list || []);
				that.setData({
					list: list
				})
			}
		})
	},

	// 查看更多
	getMore: function(e) {
		const idx = e.target.dataset.id;
		this.getCatGame(idx)
	},

	getList: function() {

		// _lib.ajax('/api/v1/category/all', )
	},
	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function(options) {
		this.getAllProduct();
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