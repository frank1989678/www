// pages/a/addGame/addGame.js
const _api = require('../../../lib/api.js');
const _lib = require('../../../lib/lib.js');
Page({
	data: {
		name: '',
		price: '',
		unit: '',
		unitId: '',
		unitList: [],

		price1: '',
		techAuthId: '',
		hidden: true,
		more: false, // 显示更多

		list: []
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
		let cid = '';
		let name = '';
		let i = 0;
		let count = list.length;
		for (; i < count; i++) {
			if (list[i].id === key) {
				name = list[i].categoryName;
				cid = list[i].categoryId;
				list[i].checked = true;
			} else {
				list[i].checked = false;
			}
		}
		this.setData({
			name: name,
			list: list,
			techAuthId: key
		})
		this.getUnit(cid);
	},

	getUnit: function(id) {
		const that = this;
		_lib.ajax(_api.b.getSalesmode, {categoryId: id}, function(res) {
			if (res.status === 200) {
				that.setData({
					unitList: res.data
				})
			}
		})
	},
	// 选择单位
	setUnit: function() {
		const that = this;
		const list = this.data.unitList;
		const name = [];
		const id = [];
		for (let i in list) {
			name.push(list[i].name);
			id.push(list[i].id);
		}
		if (list.length === 0) {
			_lib.showMsg('请先选择游戏');
		} else {
			wx.showActionSheet({
				itemList: name,
				success: function(res) {
					that.setData({
						unit: name[res.tapIndex],
						unitId: id[res.tapIndex]
					})
				}
			})
		}
		
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
		}else if (val > 99) {
			_lib.showMsg('价格不能大于99')
		}  else {
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

	// 保存
	submitForm: function() {
		const para = {
			techAuthId: this.data.techAuthId,
			price: this.data.price,
			unitId: this.data.unitId
		}
		if (para.techAuthId === '') {
			_lib.showMsg('请选择游戏');
		} else if (para.price === '') {
			_lib.showMsg('请输入价格');
		} else if (para.unit === '') {
			_lib.showMsg('请选择单位');
		} else {
			_lib.ajax(_api.b.addProduct, para, function(res) {
				if (res.status == 200) {
					_lib.goback();
				} else {
					_lib.showMsg(res.msg);
				}
			});
		}
	},
	getList: function() {
		const that = this;
		_lib.ajax(_api.b.getProduct, {}, function(res) {
			if (res.status === 200) {
				that.setData({
					list: res.data
				})
			}
		})
	},
	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function(options) {
		this.getList();
	}
})