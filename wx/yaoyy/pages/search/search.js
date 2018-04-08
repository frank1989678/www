var app = getApp();
Page({
    timer: 0,
    data: {
        list: [],
        his: []
    },
    onLoad: function() {
        this.showHistory();
    },
    search: function(keyword) {
        var that = this;

        wx.request({
            url: app.serverURL + 'search.php',
            data: {keyword: keyword},
            success: function(res) {
                that.setData({
                    list: res.data.list
                })
                var model = [];
            }
        })
    },
    autocomplete: function(e) {
        var that = this,
            keyword = e.detail.value;

        this.setData({
            list: keyword == '' ? [] : that.list
        })

        that.timer && clearTimeout(that.timer);
        that.timer = setTimeout(function() {
            keyword && that.search(keyword);
        }, 300);
    },
    link: function(e) {
        var that = this,
            id = e.target.dataset.id,
            val = e.target.dataset.val;

        if (id) {
            that.addHistory(id, val);
            wx.navigateTo({
                url: '/pages/detail/detail?id=' + id
            });
        }
    },
    // 添加历史记录
    addHistory: function(key, value) {
        var his = wx.getStorageSync('his') || {};
        his[key] = value;
        wx.setStorageSync('his', his);
    },
    // 显示历史记录
    showHistory: function() {
        var his = wx.getStorageSync('his') || {},
            _his = [];

        for (var i in his) {
            _his.push({
                id: i,
                name: his[i]
            })
        }
        this.setData({
            his: _his
        })
    }
})