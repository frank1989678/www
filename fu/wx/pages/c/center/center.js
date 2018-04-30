// pages/a/orderList/orderList.js
const _lib = require('../../../lib/lib.js');
Page({
	data: {
	    userInfo: {
	      avatarUrl: '',
	      nickName: '',
	      mobile: '18820981209',
	    	verity: false
	    }
	},
  // 读取本地存储的用户信息
  getUserInfo: function() {
    const userInfo = wx.getStorageSync('user');
    this.setData({
      userInfo: {
        avatarUrl: userInfo.avatarUrl,
        nickName: userInfo.nickName,
	    mobile: '18820981209',
	    verity: true
      }
    })
  },
	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function(options) {
	    this.getUserInfo();
	}
})