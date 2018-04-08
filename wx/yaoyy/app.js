App({
	picURL: "http://static.yaobest.com/",
	serverURL: "http://192.168.1.28/php/",
	userInfo: {},
	total: 0,
	onLaunch: function() {
		this.login();
		this.getUnit();
		this.initCart();
		// wx.clearStorageSync();
	},
	login: function() {
		var that = this;
		wx.login({
			success: function() {
				wx.getUserInfo({
					success: function(res) {
						that.userInfo = res.userInfo;
					}
				})
			}
		});
	},
    getUnit: function() {
        var that = this;
        wx.request({
            url: that.serverURL + 'unit.php',
            success: function(res) {
            	that.unit = res.data;
            }
        })
    },
    linkto: function(e) {
        wx.navigateTo({
            url: '/pages/detail/detail?id=' + e.currentTarget.dataset.id
        });
    },
    // 缓存购物车数据
    setCart: function(data) {
		wx.setStorageSync('cart', data);
		this.initCart();
    },
    // 获取购物车数据
    getCart: function() {
        return wx.getStorageSync('cart') || {};
    },
    // 清空购物车
    clearCart: function() {
        wx.removeStorageSync('cart');
    },
    // 计算购物车商品总数
    initCart: function() {
    	var cart = this.getCart(),
    		total = 0;
    	for (var i in cart) {
    		total += parseInt(cart[i], 10);
    	}
    	this.total = total;
    }
})