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
    _lib.ajax(_api.BALANCE, {}, res => {
      // console.log(res)
      this.setData({
        money: res.data || 0
      })
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getBalance();
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})