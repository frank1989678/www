var app = getApp();
var common = require('../../util/util.js');
Page({
    data: {
        disabled: true, // 提交按钮默认禁用
        quote: [],
        empty: false,
        iid: ''
    },
    onLoad: function(options) {
        this.getDate(options.id || '');
    },
    getDate: function(iid) {
        var that = this;
        that.setData({
            total: app.total, // 购物车商品数量
            commentList: [],
            pageSize: 1,
            nomore: false
        })
        wx.showToast({
            title: '加载中',
            icon: 'loading',
            duration: 1e4
        })
        wx.request({
            url: app.serverURL + 'quotation.php',
            data: {iid: iid},
            success: function(res) {
                wx.hideToast();
                if (res.data.empty) {
                    that.setData({
                        empty: true
                    })
                } else {
                    that.setData({
                        iid: res.data.iid,
                        title: res.data.title,
                        desc: res.data.desc,
                        quote: JSON.parse(res.data.quote),
                        his: res.data.his
                    })
                    that.getComment();
                }
            },
            fail: function() {
                wx.hideToast();
                that.setData({
                    empty: true
                })
            }
        })
    },
    // 上拉加载回调接口
    onReachBottom: function() {
        this.getComment();
    },
    // 加载评论
    getComment : function() {
        var that = this,
            pageSize = that.data.pageSize;

        if (that.data.nomore || !that.data.iid) {
            return that;
        }

        wx.request({
            url: app.serverURL + 'quote_feed.php',
            data: {pageSize: pageSize, qid: that.data.iid},
            success: function(res) {
                that.setData({
                    nomore: res.data.nomore
                })
                that.avatar(res.data.commentList);
            }
        })
    },
    avatar: function(data) {
        var that = this;
        var m = ['01','02','03','04','05','06','07','08','09','10'];
        for (var k = 0; k < data.length; k ++) {
            var i = Math.floor(Math.random() * m.length);
            data[k].avatar = '/avatar/' + m[i] + '.png';
            data[k].date = common.timeago.elapsedTime(data[k].create_time);
            m.splice(i, 1);
        }
        that.setData({
            pageSize: that.data.pageSize + 1,
            commentList: that.data.commentList.concat(data)
        })
    },
    // 激活提交按钮
    setDisabled: function(e) {
        this.setData({
            disabled: e.detail.value == ''
        })
    },
    // 提交
    formSubmit: function(e) {
        var that = this;
        that.setData({
            disabled: true
        })
        that.submit(e.detail.value.words);
    },
    submit: function(content) {
        var that = this;
        wx.request({
            url: app.serverURL + 'quote_feed_save.php',
            data: {
                qid: that.data.iid,
                nickname: app.userInfo.nickName,
                content: content,
                avatar: app.userInfo.avatarUrl
            },
            success: function(res) {
                if (res.data.status == '1') {
                    that.data.commentList.unshift(res.data.info);
                    that.setData({
                        commentList: that.data.commentList
                    })
                }
            },
            fail: function() {
                that.setData({
                    disabled: false
                })
            }
        })
    }
})