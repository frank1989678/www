// pages/a/addGame/addGame.js
const _lib = require('../../../lib/lib.js');
Page({
	data: {
		name: '',
		price: '',
		unit: '',

		price1: '',
		openId: '',
		hidden: true,
		more: false, // 显示更多

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
		}, {
			'name': '刺激战场',
			'key': '3',
			'checked': false,
			'icon': 'http://localhost/wallpaper/avatar/02.png',
			'price': 14,
			'unit': '小时'
		}, {
			'name': '英雄联盟',
			'key': '4',
			'checked': false,
			'icon': 'http://localhost/wallpaper/avatar/02.png',
			'price': 14,
			'unit': '小时'
		}, {
			'name': '穿越火线',
			'key': '5',
			'checked': false,
			'icon': 'http://localhost/wallpaper/avatar/02.png',
			'price': 14,
			'unit': '小时'
		}],
	},

	// 显示更多
	showMore: function() {
		this.setData({
			more: !this.data.more
		})
	},

	// 选择游戏
	chooseGame: function(e) {
		const key = e.target.dataset.key;
		const list = this.data.list;
		let name = '';
		let i = 0;
		let count = list.length;
		for (; i < count; i++) {
			if (list[i].key === key) {
				name = list[i].name;
				list[i].checked = true;
			} else {
				list[i].checked = false;
			}
		}
		this.setData({
			name: name,
			list: list,
			openId: key
		})
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
			_lib.showMsg('只能输入数字')
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

	// 保存
	submitForm: function() {
		const para = {
			openId: this.data.openId,
			price: this.data.price,
			unit: this.data.unit
		}
		if (para.openId === '') {
			_lib.showMsg('请选择游戏');
		} else if (para.price === '') {
			_lib.showMsg('请输入价格');
		} else if (para.unit === '') {
			_lib.showMsg('请选择单位');
		} else {
			_lib.ajax('', para, function(res) {
				if (res.status == 200 || 22 > 3) {
					wx.reLaunch({
						url: '/pages/a/setting/setting'
					})
				}
			});
		}
	},
	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function(options) {

	}
})