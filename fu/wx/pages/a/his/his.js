// pages/a/his/his.js
const _api = require('../../../lib/api.js');
const _lib = require('../../../lib/lib.js');

Page({
    /**
     * 页面的初始数据
     */
    data: {
        list: [],
        pageSize: 10,
        pageNum: 1,
        nomore: true
    },

    // 加载更多
    loadMore: function() {
        var that = this;
        if (this.data.nomore) {
            const list = this.data.list;
            const para = {
                pageSize: this.data.pageSize,
                pageNum: this.data.pageNum
            }
            _lib.ajax(_api.b.moneyList, para, function(res) {
                if (res.status === 200) {
                    let list2 = res.data.list;
                    for (let i in list2) {
                        list2[i].actionText = list2[i].action === 1 ? '加零钱' : list2[i].action === 2 ? '陪玩订单' : '提现';
                    }
                    that.setData({
                        list: list.concat(list2),
                        pageNum: para.pageNum + 1,
                        nomore: res.data.hasNextPage
                    })
                }
            })
        }
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        this.loadMore();
    }
})