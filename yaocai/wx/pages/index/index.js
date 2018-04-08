var app = getApp();
Page({
    onLoad: function() {
        this.setData({
            total: app.total
        })        
        wx.showToast({
            title: '加载中',
            icon: 'loading',
            duration: 1e4
        })
        this.getBanner();
        this.getSpecial();
    },
    // banner
    getBanner: function() {
        var that = this;
        wx.request({
            url: app.serverURL + 'ad.php',
            data: {type_id: 1},
            success: function(res) {
                wx.hideToast();
                that.setData({
                    banner: that.processData(res.data)
                })
            },
            fail: function() {
                wx.hideToast();
            }
        })
    },
    // 系列
    getSpecial: function() {
        var that = this;
        wx.request({
            url: app.serverURL + 'ad.php',
            data: {type_id: 2},
            success: function(res) {
                wx.hideToast();
                that.setData({
                    special: that.processData(res.data)
                })
            },
            fail: function() {
                wx.hideToast();
            }
        })
    },
    // 图片地址处理
    processData: function(data) {
        for (var i = 0; i < data.length; i++) {
            data[i].picture_url = data[i].picture_url.replace('/opt/resources/yaobest', app.picURL);
        }
        return data;
    },
    linkto: function(e) {
        // 表里面的值是url，测试环境无法直接使用
        wx.navigateTo({
            url: '/pages/special/special?id=' + e.currentTarget.dataset.id.replace('http://www.yaobest.com/special/','')
        });
    },
    linkto2: function(e) {
        // 表里面的值是url，测试环境无法直接使用
        wx.navigateTo({
            url: '/pages/introduce/introduce'
        });
    }
})
