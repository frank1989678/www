// pages/a/orderList/orderList.js
const _api = require('../../../lib/api.js');
const _lib = require('../../../lib/lib.js');
Page({
	data: {
		avatarUrl: '',
		nickName: '',
		mobile: '',
		verity: false
	},
  // 读取本地存储的用户信息
  getUserInfo: function() {
  	const that = this;
    const userInfo = wx.getStorageSync('user');

    const para = {
    	mobile: true,
    	idcard: true,
    	gender: true,
    	realname: true,
    	age: true
    }

    _lib.ajax(_api.CENTER, para, function(res) {
    	that.setData({
    		mobile: res.mobile || '',
    		verity: res.userInfoAuth || false
    	})
    })
    this.setData({
        avatarUrl: userInfo.avatarUrl,
        nickName: userInfo.nickName
    })


  },
	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function(options) {
	    this.getUserInfo();
	}
})