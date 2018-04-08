var app = getApp();
Page({
	data: {
		disabled: true,
		currentTab: 0,
		faved: 0,
		empty: true
	},
	onLoad: function(options) {
		this.setData({
			id: options.id || 1,
			unit: app.unit,
            total: app.total
        })
		this.getData();
	},
	getData: function() {
		var that = this;
        wx.showToast({
            title: '加载中',
            icon: 'loading',
            duration: 1e4
        })
		wx.request({
			url: app.serverURL + 'detail.php?id=' + that.data.id,
			success: function(res) {
				var data = res.data;
				wx.hideToast();
				that.setData({
					info: data.info,
					faved: data.faved,
					banner: data.banner.replace('/opt/resources/yaobest', app.picURL),
					attr: JSON.parse(data.attr),
					min: parseInt(data.min, 10),
					inputValue: parseInt(data.min, 10),
					empty: false
				})
			},
            fail: function() {
                wx.hideToast();
            }
		})
	},
	swichNav: function(e) {
		var that = this,
			cid = e.currentTarget.dataset.current;
		if (this.data.currentTab === cid) {
			return false;
		} else {
			that.setData({
				currentTab: cid
			})
		}
	},
	// 加入购物车
	addCart: function() {
		var cart = app.getCart(),
			data = this.data,
			count = Math.max(this.data.inputValue);

		if (cart[data.id]) {
			count = Math.max(cart[data.id] + this.data.inputValue, this.data.min);
		}
		cart[data.id] = count;

		app.setCart(cart);
		this.setData({
			total: app.total
		})
		wx.showToast({
		  	title: '加入采购单成功',
		  	duration: 3e3
		})
	},
	// 输入数量
	quantityBlur: function(e) {
		var inputValue = Math.max(e.detail.value, this.data.min);
		if (isNaN(inputValue)) {
			inputValue = this.data.min;
		}
		this.setData({
        	disabled: inputValue == this.data.info.min,
			inputValue: inputValue
		})
		return inputValue;
	},
	// 减少数量
	minus: function() {
		this.setNum(-1);
	},
	// 增加数量
	plus: function() {
		this.setNum(1);
	},
    // 存入数量
    setNum: function(increment) {
    	var inputValue = Math.max(this.data.inputValue + increment, this.data.min);
        this.setData({
        	disabled: inputValue == this.data.min,
            inputValue: inputValue
        })
    },
	// 关注
	fav: function() {
		this.follow(1);
	},
	// 取消关注
	unfav: function() {
		this.follow(0);
	},
	// 保存关注状态
	follow: function(status) {
		var that = this;
		that.setData({
			faved: status
		})
		var debounce = function() {
			wx.request({
				url: app.serverURL + 'follow.php',
				data: {
					id: that.data.id,
					user_id: 133,
					faved: status,
					price: that.data.info.price
				}
			})
		}
		clearTimeout(that.timer);
		that.timer = setTimeout(function() {
			debounce();
		}, 300);
	},
	// 拨号
	call: function() {
		wx.makePhoneCall({
		  	phoneNumber: '18056796628' //仅为示例，并非真实的电话号码
		})
	},
	// 跳转
    linkto: function(e) {
        wx.redirectTo({
            url: '/pages/detail/detail?id=' + e.currentTarget.id
        });
    }
})