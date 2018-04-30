// pages/a/withdraw/withdraw.js

const _api = require('../../../lib/api.js');
const _lib = require('../../../lib/lib.js');
const _reg = require('../../../lib/reg.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    money: '', // 提现金额
    surplus: '', // 余额
    account: '', 
    realname: ''
  },
  // 数据绑定
  changeInput: function(e) {
    const key = e.target.id;
    this.setData({
      [key]: _lib.trim(e.detail.value)
    })
  },
  // 获取零钱
  getBalance: function() {
    _lib.ajax(_api.BALANCE, {}, res => {
      this.setData({
        surplus: res.data || 0
      })
    })
  },

  // 最多提现
  getAll: function() {
    this.setData({
      money: this.data.surplus
    })
  },

  submitForm: function() {
    const para = this.data;
    if (para.money == '') {
      _lib.showMsg('请输入提现金额')
    } else if (!_reg.isMoney(para.money)) {
      _lib.showMsg('金额输入错误，小数部分最多到分');
    } else if (para.account == '') {
      _lib.showMsg('请输入支付宝账号')
    } else if (para.realname == '') {
      _lib.showMsg('请输入真是姓名')
    } else {
      wx.redirectTo({
          url: '/pages/a/wallet/wallet'
      })
      return;
      _lib.ajax('', para, function(res) {
        wx.redirectTo({
          url: '/pages/a/wallet/wallet'
        })
      }, function(err) {
          _lib.showMsg(err);
      })
    }
  },

  goback: function() {
    wx.navigateBack();
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