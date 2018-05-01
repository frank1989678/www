// pages/c/card/card.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    current: 0,
    imgUrls: [
      '../../../images/ico/1.jpg',
      '../../../images/ico/2.jpg',
      '../../../images/ico/3.jpg'
    ],

    title: '绝地求生陪玩',
    tag: [
      {'key': 1, 'name': '搜图达人'},
      {'key': 2, 'name': '医疗兵'}
    ],
    desc: '人丑声不甜，枪刚打队友贼准，快来和我一起战斗吧',
    price: '72.00',
    unit: '小时',
    total: 2981,
    score: '5.0',

    userInfo: {
      avatarUrl: '',
      nickName: '',
      score: '',
      star: '',
      age: '',
      sex: '2',
      tag: ''
    },
    src: 'http://ws.stream.qqmusic.qq.com/M500001VfvsJ21xFqb.mp3?guid=ffffffff82def4af4b12b3cd9337d5e7&uin=346897220&vkey=6292F51E1E384E061FF02C31F716658E5C81F5594D561F2E88B854E81CAAB7806D5E4F103E55D33C16F3FAC506D1AB172DE8600B37E43FAD&fromtag=46',

    list: [{
      'icon': '../../../images/ico/1.jpg',
      'name': '绝地求生陪玩',
      'price': '72.00',
      'unit': '小时',
      'tag': [
        {'key': 1, 'name': '搜图达人'},
        {'key': 2, 'name': '医疗兵'}
      ]
    }],

    comment: [{
      avatarUrl: '../../../images/ico/5.jpg',
      star: '5',
      score: '5.0',
      nickName: '自在',
      desc: '这个妹子声音好听惨了，人也长得漂亮。',
      time: '2018-04-23  21:32:05'
    }],

    playing: false
  },

  // swiper 索引
  changeIndicator: function(e) {
    this.setData({
      current: e.detail.current
    })
  },

  listenBgVoice: function() {
    const that = this;
    wx.onBackgroundAudioPlay(function(){
      that.setData({
        playing: true
      })
    })
    wx.onBackgroundAudioPause(function(){
      that.setData({
        playing: false
      })
    })
    wx.onBackgroundAudioStop(function(){
      that.setData({
        playing: false
      })
    })
  },

  getDuration: function(src, call) {
    const audio = wx.createInnerAudioContext('myAudio');
    audio.src = src;
    const timer = setInterval(function() {
      const duration = audio.duration;
      if (duration > 0) {
        clearInterval(timer);
        call(duration)
      }
    }, 1e3)
  },

  playSound: function(e) {
    const that = this;
    const filePath = e.currentTarget.dataset.url;
    if (filePath) {
      if (this.data.playing) {
        wx.stopBackgroundAudio();
      } else {
        wx.playBackgroundAudio({
          dataUrl: filePath
        })
      }
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
        city: '武汉市',
        time: '一天前'
      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.listenBgVoice();
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