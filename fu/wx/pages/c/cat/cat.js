// pages/c/cat/cat.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        list: []
    },


    // 全部游戏分类接口
    getAllProduct: function() {
        const that = this;
        _lib.ajax(_api.category, {}, function(res) {
            if (res.status === 200) {
                let list = res.data;
                that.setData({
                    list: list
                })
            }
        })
    },
    onLoad: function(options) {
      this.getAllProduct();
    }
})