// pages/a/detail/detail.js
const _lib = require('../../../lib/lib.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: {
      avatarUrl: '',
      nickName: '',
      score: '',
      star: '',
      age: '',
      sex: '2',
      tag: ''
    },

    catogery:'王者荣耀 陪玩',
    unit:'小时',
    num: 1,
    price: '35.00',
    total: '35.00'
  },
  // 数据绑定
  changeInput: function(e) {
    const key = e.target.id;
    let val = _lib.trim(e.detail.value);

    if (key === 'num') {
      if (isNaN(val)) {
        val = 1;
      } else {
        val *= 1;
        val = Math.max(val, 1);
        console.log(val)
      }
      this.setData({
        num: val,
        total: val * this.data.price
      })
    } else {
      this.setData({
        [key]: val
      })
    }

  },

  changeNum: function(e) {
    const key = e.target.dataset.key;
    let num = this.data.num * 1;
    if (isNaN(num)) {
      num = 1;
    }
    if (key && !isNaN(key)) {
      num += (1 * key);
      num = Math.max(num, 1);
      this.setData({
        num: num,
        total: num * this.data.price
      })
    }
  },

  // 读取本地存储的用户信息
  getUserInfo: function() {
    const userInfo = wx.getStorageSync('user');
    this.setData({
      userInfo: {
        avatarUrl: userInfo.avatarUrl,
        nickName: userInfo.nickName,
        score: '5.0',
        star: 5,
        age: '22',
        sex: '2',
        tag: '♀ 22',
        city: '武汉市'
      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getUserInfo();
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