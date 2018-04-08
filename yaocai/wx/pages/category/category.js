var app = getApp();
Page({
    data: {
        list: [],
        nomore: false,
        pageSize: 1,
        loadingHidden: false
    },
    onLoad: function() {
        this.setData({
            unit: app.unit,
            total: app.total
        })
        wx.showToast({
            title: '加载中',
            icon: 'loading',
            duration: 1e4
        })
        this.getDate();
    },
    getDate: function() {
        var that = this,
            pageSize = that.data.pageSize;

        wx.request({
            url: app.serverURL + 'commodity.php',
            data: {pageSize: pageSize},
            success: function(res) {
                var data = res.data.data;
                wx.hideToast();
                that.setData({
                    loadingHidden: true,
                    pageSize: pageSize + 1,
                    nomore: res.data.nomore,
                    list: that.data.list.concat(data)
                })
            },
            fail: function(res) {
                wx.hideToast();
            }
        })
    },
    // 上拉加载回调接口
    onReachBottom: function() {
        !this.data.nomore && this.getDate();
    },
    linkto: function(e) {
        wx.navigateTo({
            url: '/pages/detail/detail?id=' + e.currentTarget.dataset.id
        });
    }
})