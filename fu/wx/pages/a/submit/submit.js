// pages/a/submit/submit.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    maxCount: 6, // 最多上传6张
    list: [
    ],
    id: '',
    note: ''
  },

  // 数据绑定
  changeInput: function(e) {
    const key = e.target.id;
    this.setData({
      [key]: _lib.trim(e.detail.value)
    })
  },

  upfilePic: function() {
    const that = this;
    const list = that.data.list;
    const maxC = that.data.maxCount - list.length;
    wx.chooseImage({
      count: maxC,
      success: function(res) {

        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        that.setData({
          list: list.concat(res.tempFilePaths)
        })
      }
    })
  },

  onPic: function(e) {
      const preview = e.target.dataset.preview;
      const del = e.target.dataset.del;
      let list = this.data.list;

      // 删除
      if (typeof del === 'number') {
        list.splice(del, 1);
        this.setData({
          list: list
        })
      } else if (typeof preview === 'number') {
        // 预览
        wx.previewImage({
          current: list[preview],
          urls: list
        })
      }
  },

  // 提交
  submit: function() {
    const para = {
      list: this.data.list,
      note: this.data.note
    }
    if (para.list.length === 0) {
      _lib.showMsg('请提交服务过程图片')
    } else {
      _lib.ajax('', para, function(res) {

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