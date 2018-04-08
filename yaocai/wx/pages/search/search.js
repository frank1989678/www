var app = getApp();
Page({
    timer: 0,
    data: {
        list: [],
        his: [],
        // inputValue: '',
        isEmpty: true // 输入框清空按钮
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
            isEmpty: keyword == '',
            list: keyword == '' ? [] : that.list
        })

        that.timer && clearTimeout(that.timer);
        that.timer = setTimeout(function() {
            keyword && that.search(keyword);
        }, 300);
    },
    // 清空输入框
    clearInput: function() {
        this.setData({
            isEmpty: true,
            list: [],
            inputValue: ''
        })
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
    getHis: function() {
        return wx.getStorageSync('his') || {};
    },
    saveHis: function(val) {
        wx.setStorageSync('his', val);
        this.showHistory();
    },
    // 显示历史记录
    showHistory: function(val) {
        var his = val || this.getHis();
        this.setData({
            his: his
        })
    },
    // 添加历史记录
    addHistory: function(key, value) {
        var his = this.getHis();
        his[key] = value;
        this.saveHis(his);
    },
    // 删除历史记录（单个）
    delHistory: function(e) {
        var that = this,
            id = e.target.dataset.id,
            his = {};

        if (id) {
            his = this.getHis();
            delete his[id];
            this.saveHis(his);
        }
    }
})