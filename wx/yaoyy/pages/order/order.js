Page({
    data: {
        order: [],
        empty: true
    },
    onLoad: function() {
        // this.getDate();
    },
    getDate: function(type) {
        var that = this;
        wx.showToast({
            title: 'loading...',
            icon: 'loading',
            duration: 1e4
        })
        wx.request({
            url: 'http://192.168.1.52/wx/json/order.json',
            success: function(res) {
                wx.hideToast();
                wx.stopPullDownRefresh();
                that.setData({
                    empty: false,
                    order: type === 'refresh' ? res.data.order : that.data.order.concat(res.data.order)
                })
            },
            fail: function() {
            	that.empty();
            }
        })
    },
    onPullDownRefresh: function() {
        this.getDate('refresh');
    },
    // 上拉加载回调接口
    onReachBottom: function() {
        this.getDate();
    },
    empty: function() {
    	this.setData({
    		empty: true
    	})
    },
    linkto: function(e) {
        wx.navigateTo({
            url: '/pages/odetail/odetail?id=' + e.currentTarget.dataset.id
        });
    },
    goIndex: function() {
        wx.switchTab({
            url: '/pages/index/index'
        });
    }
})
