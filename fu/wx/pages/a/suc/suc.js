// pages/a/suc/suc.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        price: '888.00'
    },

    onLoad: function(params) {
        this.setData({
            price: params.price || 0
        })
    }
})