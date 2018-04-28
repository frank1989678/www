// pages/a/orderList/orderList.js
const _lib = require('../../../lib/lib.js');
Page({
	data: {
		score: '0',
		count: '0',
		income: '0',
		price: '',
		unit: '',
		list: [{
			'name': '绝地求生',
			'key': '1',
			'checked': false,
			'icon': 'http://localhost/wallpaper/avatar/01.png',
			'price': 14,
			'unit': '元'
		}, {
			'name': '王者荣耀',
			'key': '2',
			'checked': false,
			'icon': 'http://localhost/wallpaper/avatar/02.png',
			'price': 14,
			'unit': '小时'
		}],

		second: 20,
		time: '',

		hidden: true,
		openId: '',
		isOpen: false
	},

	// 选择游戏
	chooseGame: function(e) {
		if (this.data.isOpen) {
			return;
		}
		const key = e.target.dataset.val;
		const list = this.data.list;
		let i = 0;
		let count = list.length;
		for (; i < count; i++) {
			list[i].checked = list[i].key === key;
		}
		this.setData({
			list: list,
			openId: key
		})
	},

	// 开始接单
	openStatus: function() {
		if (this.data.openId) {
			this.setData({
				isOpen: true
			})

		} else {
			lib.showMsg('请选择游戏');
		}
	},
	// 停止接单
	clsoeStatus: function() {

	},

	// 修改价格
	setPrice: function(e) {
		this.setData({
			hidden: !this.data.hidden
		})
	},
	// 保存价格
	savePrice: function() {
		let val = this.data.price1;
		if (isNaN(val)) {
			lib.showMsg('只能输入数字')
		} else {
			this.setData({
				price: val,
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
	// 选择单位
	setUnit: function() {
		const that = this;
		const unit = ['30分钟', '1小时', '2小时']
		wx.showActionSheet({
			itemList: unit,
			success: function(res) {
				that.setData({
					unit: unit[res.tapIndex]
				})
			}
		})
	},

	// 倒计时
	cutDown: function() {
		const that = this;
		let second = this.data.second;
		const showTime = function() {
			var hh = Math.floor(second / 3600 % 24);
			var mm = Math.floor(second / 60 % 24);
			var ss = Math.floor(second % 60);
			var time = hh + ' 小时 ' + mm + ' 分 ' + ss + ' 秒'
			that.setData({
				time: time
			})
		}
		if (this.data.second > 0) {
			this.setData({
				isOpen: true
			})
		} else {
			showTime();
		}
		var timer = setInterval(function() {
			second--;
			showTime();
			if (second <= 0) {
				clearInterval(timer);
				that.setData({
					isOpen: false
				})
			}
		}, 1e3);
	},
	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function(options) {
		this.cutDown();
	}
})