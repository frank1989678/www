// pages/c/set/set.js
const _api = require('../../../lib/api.js');
const _lib = require('../../../lib/lib.js');
Page({
    data: {
        avatarUrl: '',
        nickName: '',
        mobile: '',
        gender: '',
        verity: false,

        model1: true, // 昵称
        date: '',
        birthday: '',
        constellation: '',
        region: [],
        city: '',
        province: '',
        country: ''
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
                mobile: res.mobile || ' ',
                verity: res.userInfoAuth || false,
                avatarUrl: userInfo.headPortraitsUrl || userInfo.avatarUrl,
                gender: _lib.formatSex(res.gender || userInfo.gender),
                city: res.city || '',
                province: res.province || '',
                country: res.country || ''
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
    },
    // 关闭弹层
    closeModel: function(e) {
        const key = e.target.id;
        this.setData({
            [key]: true
        })
    },
    // 数据绑定
    changeInput: function(e) {
        const key = e.target.id;
        this.setData({
            [key]: _lib.trim(e.detail.value)
        })
    },
    // 设置头像
    setAvatar: function() {
        const that = this;
        const unit = ['手机相册选取', '拍照']
        wx.showActionSheet({
            itemList: unit,
            success: function(res) {
                wx.chooseImage({
                    count: 1,
                    sourceType: res.tapIndex === 0 ? 'album' : 'camera',
                    success: function(res) {
                        that.saveInfo({
                            headPortraitsUrl: res.tempFilePaths[0]
                        });
                        that.setData({
                            avatarUrl: res.tempFilePaths[0]
                        })
                    }
                })
            }
        })
    },

    setNickname: function() {
        this.setData({
            model1: false
        })
    },
    saveNickName: function() {
        let val = this.data._nickName;
        this.setData({
            model1: true
        })
        if (_lib.trim(val) !== '') {
            this.setData({
                nickName: val
            })
        }
    },

    setSex: function() {
        const that = this;
        const unit = ['男', '女'];
        wx.showActionSheet({
            itemList: unit,
            success: function(res) {
                const val = res.tapIndex === 0 ? '1' : '2';
                that.setData({
                    gender: unit[res.tapIndex]
                })
                // _lib.ajax(_api.UPDATEINFO, {}, function(res) {});
            }
        })
    },

    setBirthday: function(e) {
        const date = e.detail.value;
        const ymd = date.split('-');
        const birthday = ymd[1] + '-' + ymd[2]
        const constellation = _lib.getAstro(ymd[1], ymd[2]);
        this.setData({
            date: e.detail.value,
            birthday: birthday,
            constellation: constellation
        })
    },

    setRegion: function(e) {
        const region = e.detail.value;
        const abc = region.split('-')
        this.setData({
            region: region,
            city: abc[0],
            province: abc[1],
            country: abc[2]
        })
    },

    saveInfo: function(para) {
        _lib.ajax(_api.UPDATEINFO, para, function(res) {
            console.log(res)
        })
    }
})