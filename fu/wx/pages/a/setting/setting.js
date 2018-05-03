// pages/a/orderList/orderList.js
const _api = require('../../../lib/api.js');
const _lib = require('../../../lib/lib.js');
Page({
	data: {
		score: '0',
		count: '0',
		income: '0',
		price: '',
		unit: '',
		list: [],

		second: 0,
		time: '',

		hidden: true,
		openId: '',
		isOpen: false,

		val: '',

		update: {
			unitId: '',
			price: '',
			techAuthId: '',
			id: ''
		}
	},

	// 激活游戏
	activeGame: function(e) {
		const that = this;
		const para = {
			id: e.target.dataset.id,
			status: !e.target.dataset.status
		}
		if (this.data.second > 0) {
			return;
		}
		_lib.ajax(_api.b.activeProduct, para, function(res) {
			if (res.status === 200) {
				that.getList();
			}
		})
	},

	// 开始接单
	openStatus: function() {
		const that = this;
		const unit = ['半小时', '1小时', '3小时'];
		const time = [0.5, 1, 3];

		// _lib.showMsg('请选择游戏');

		wx.showActionSheet({
			itemList: unit,
			success: function(res) {
				const para = {
					hour: time[res.tapIndex]
				}
				_lib.ajax(_api.b.start, para, function(res) {
					if (res.status === 200) {
						that.setData({
							isOpen: true,
							second: para.hour * 60 * 60
						})
						
						that.cutDown();
					}
				})
				
			}
		})
	},
	// 停止接单
	closeStatus: function() {
		const that = this;
		_lib.ajax(_api.b.stop, {}, function(res) {
		if (res.status === 200) {
				clearInterval(that.timer);
				that.setData({
					isOpen: false,
					second: 0
				})
			}
		})
	},
	// 修改价格
	setPrice: function(e) {
		const item = e.target.dataset.id;
		this.setData({
			hidden: !this.data.hidden
		})
		if (typeof item === 'object') {
			const para = {
				unitId: '',
				techAuthId: '',
				price: item.price,
				id: item.id
			}
			this.setData({
				update: para
			})
		}
	},
	// 保存价格
	savePrice: function() {
		let val = this.data.price1;
		if (isNaN(val)) {
			_lib.showMsg('只能输入数字')
		} else if (val > 99) {
			_lib.showMsg('价格不能大于99')
		} else {
			let para = this.data.update;
			para.price = val;
			this.update(para);
			this.setData({
				val: '',
				hidden: true
			})
		}
	},
	// 价格变动映射到data
	priceInput: function(e) {
		let val = e.detail.value;
		this.setData({
			price1: val
		})
	},
	getUnit: function(item) {
		const that = this;
		_lib.ajax(_api.b.getSalesmode, {categoryId: item.id}, function(res) {
			if (res.status === 200) {
				const unit = res.data;
				const name = [];
				const id = [];
				for (let i in unit) {
					name.push(unit[i].name);
					id.push(unit[i].id);
				}
				wx.showActionSheet({
					itemList: name,
					success: function(res) {
						item.unitId = id[res.tapIndex]
						that.update(item);						
					}
				})
			}
		})
	},
	// 选择单位
	setUnit: function(e) {
		const that = this;
		const item = e.target.dataset.id;
		if (this.data.second > 0 || typeof item !== 'object') {
			return;
		}
		this.getUnit(item);
	},

	update: function(item) {
		const that = this;
		const para = {
			unitId: item.unitId,
			price: item.price,
			techAuthId: item.techAuthId,
			id: item.id
		}
		_lib.ajax(_api.b.updateProduct, para, function(res) {
			if (res.status === 200) {
				that.getList();
			}
		})
	},

	// 倒计时
	cutDown: function() {
		const that = this;
		const showTime = function() {
			var hh = Math.floor(second / 3600 % 24);
			var mm = Math.floor(second / 60 % 60);
			var ss = Math.floor(second % 60);
			var time = hh + ' 小时 ' + mm + ' 分 ' + ss + ' 秒'
			that.setData({
				isOpen: true,
				time: time
			})
		}

		let second = this.data.second;

		if (second > 0) {
			showTime();
			that.timer = setInterval(function() {
				showTime();
				second--;
				if (second <= 0) {
					clearInterval(that.timer);
					that.setData({
						isOpen: false
					})
				}
			}, 1e3);
		}
	},
	getList: function() {
		const that = this;
		_lib.ajax(_api.b.getActiveList, {}, function(res) {
			that.setData({
				list: res.data
			})
		})
	},
	// 查询倒计时
	getSecond: function() {
		const that = this;
		_lib.ajax(_api.b.getSeconds, {}, function(res) {
			if (res.status === 200 && res.data.HOUR) {
				const t3 = res.data.HOUR * 60 * 60;
				const t1 = res.data.START_TIME;
				const t2 = res.data.CURRENT_TIME;
				const t4 = Math.max(t3 - (t2 - t1) / 1e3, 0);
				that.setData({
					second: t4
				})
				that.cutDown();
			}
		})
	},
	// 用户收入评分和单数信息接口
	getInfo: function() {
		const that = this;
		_lib.ajax(_api.b.weekInfo, {}, function(res) {
			if (res.status === 200) {
				that.setData({
					score: res.data.scoreAvg,
					income: res.data.weekIncome,
					count: res.data.weekOrderCount
				})
			}
		})
	},
	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function(options) {
		this.getInfo();
	},
	onShow: function() {
		this.getSecond();
		this.getList();
	}
})