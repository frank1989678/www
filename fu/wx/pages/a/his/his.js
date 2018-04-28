// pages/a/his/his.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list: [
      {'datetime': '2018-04-23 11:29', 'action':'陪玩订单', 'cost': '25.00', 'surplus': '100.35'},
      {'datetime': '2018-04-23 11:29', 'action':'陪玩订单', 'cost': '25.00', 'surplus': '100.35'},
      {'datetime': '2018-04-23 11:29', 'action':'陪玩订单', 'cost': '25.00', 'surplus': '100.35'}
    ]
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