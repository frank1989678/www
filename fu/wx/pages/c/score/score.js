// pages/c/score/score.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    stars: [0, 1, 2, 3, 4],
    star1: '../../../images/star1.png',
    star2: '../../../images/star2.png',
    key: 0,
    anonymity: false
  },
  // 打分
  setStar: function(e) {
    const key = e.target.dataset.key;
    if (key) {
        this.setData({
          key: key
        })
    }
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
  cbx: function() {
    this.setData({
      anonymity: !this.data.anonymity
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  
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