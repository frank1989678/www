// pages/a/order/order.js
const _api = require('../../../lib/api.js');
const _lib = require('../../../lib/lib.js');

Page({
	data: {
		list1: [],
		name1: '所有技能',
		hidden1: false,
		name1_id: '',

		list2: [],
		name2: '全部状态',
		hidden2: false,
		name2_id: 0,

		list: [],
		pageNum: 1,
		pageSize: 10,

        nomore: true
	},

	showSelect: function(e) {
		var key = e.target.dataset.key || '';
		var name = e.target.dataset.name;
		var val = e.target.dataset.val;

		if (name) {
			this.setData({
				hidden1: false,
				hidden2: false,
				[name]: val,
				[name + '_id']: key
			})
			this.getList();
		} else if (key.indexOf('hidden') > -1) {
			const status = this.data[key];
			this.setData({
				hidden1: false,
				hidden2: false,
				[key]: !status
			})
		}

	},

	bindPickerChange: function(e) {
		console.log(e)
	},

	// 加载更多
	loadMore: function() {
		const that = this;
        if (this.data.nomore) {
            const list = this.data.list;
            const para = {
				pageNum: this.data.pageNum,
				pageSize: this.data.pageSize,
				categoryId: this.data.name1_id,
				status: this.data.name2_id
            }
            _lib.ajax(_api.b.getUserOrder, para, function(res) {
                if (res.status === 200) {
                    let list2 = res.data.list;
                    for (let i in list2) {
                    	list2[i].tag = list2[i].name.split('-')[0];
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

	// lazyload
	lazyload: function() {

	},

	// 详情页
	goPage: function() {
		wx.reLaunch({
			url: '/pages/login/login'
		})
	},

	// 全部游戏列表
	getAllProduct: function() {
		const that = this;
		_lib.ajax(_api.category, {}, function(res) {
			if (res.status === 200) {
				let list = res.data;
				list.unshift({'name': '所有技能','id': ''});
				that.setData({
					list1: list,
					name1_id: 0
				})
			}
		})
	},
	// 全部订单状态
	getAllStatus: function() {
		const that = this;
		_lib.ajax(_api.b.orderStatus, {}, function(res) {
			if (res.status === 200) {
				let list = res.data;
				that.setData({
					list2: list,
					name2: list[0],
					name2_id: 0
				})
			}
		})
	},


	getList: function() {
		this.setData({
			nomore: true
		})
		this.loadMore();
	},
	// 获取筛选条件列表
	getFilter: function() {
		this.getAllProduct();
		this.getAllStatus();
	},
	onLoad: function(options) {
		this.getFilter();
		this.getList();
	}
})