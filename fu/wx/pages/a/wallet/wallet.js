// pages/a/wallet/wallet.js
const _api = require('../../../lib/api.js');
const _lib = require('../../../lib/lib.js');
Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		money: 0
	},

	// 无零钱提示
	tips: function() {
		wx.showModal({
			title: '提示',
			content: '提现需要满足零钱大于0元',
			showCancel: false
		})
	},
	// 获取零钱 
	getBalance: function() {
		_lib.ajax(_api.b.getBalance, {}, res => {
			this.setData({
				money: res.data || 0
			})
		})
	},
	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function(options) {
		this.getBalance();
	}
})