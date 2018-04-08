var app = getApp();
Page({
    data: {
        userInfo: {}
    },
    onLoad: function() {
        var that = this;
        this.setData({
        	userInfo: app.userInfo,
            total: app.total
        })
    }
})
