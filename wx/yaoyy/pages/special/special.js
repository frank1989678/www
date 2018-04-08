var app = getApp();
Page({
    data: {
        list: [],
        nomore: false,
        pageSize: 1,
        loadingHidden: false
    },
    onLoad: function(options) {
        this.setData({
            pid: options.id || ''
        })
        wx.showToast({
            title: '加载中',
            icon: 'loading',
            duration: 1e4
        })
        this.getInfo();
        this.getDate();
    },
    getInfo: function() {
        var that = this;
        wx.request({
            url: app.serverURL + 'specialInfo.php',
            data: {pid: that.data.pid},
            success: function(res) {
                wx.setNavigationBarTitle({title: res.data.title});
                that.setData({
                    banner: res.data.pictuer_url.replace('/opt/resources/yaobest', app.picURL)
                })
            }
        })
    },
    getDate: function(type) {
        var that = this,
            pageSize = type ? 1 : that.data.pageSize;

        wx.request({
            url: app.serverURL + 'special.php',
            data: {pageSize: pageSize, pid: that.data.pid},
            success: function(res) {
                var data = res.data.data;
                wx.hideToast();
                wx.stopPullDownRefresh();
                that.setData({
                    loadingHidden: true,
                    pageSize: pageSize + 1,
                    nomore: res.data.nomore,
                    list: type === 'refresh' ? data : that.data.list.concat(data)
                })
            },
            fail: function(res) {
                wx.hideToast();
                wx.stopPullDownRefresh();
            }
        })
    },
    onPullDownRefresh: function() {
        this.getDate('refresh');
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
