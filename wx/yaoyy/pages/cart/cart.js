var app = getApp();
Page({
    data: {
        cart: {},
        empty: false,
        minusStatuses: [],
        unit: app.unit
    },
    onLoad: function() {
        this.setData({
            total: app.total
        })
        this.initCart();
    },
    initCart: function() {
        var that = this,       
            cart = app.getCart(),
            commodityIds = []; // 购物车商品id数组

        for (var i in cart) {
            commodityIds.push(i);
        }
        if (commodityIds.length != 0) {
            that.getDate(commodityIds);
        } else {            
            that.setData({
                empty: true
            })
        }
    },
    getDate: function(ids) {
        var that = this;
        wx.showToast({
            title: '加载中',
            icon: 'loading',
            duration: 1e4
        })
        wx.request({
            url: app.serverURL + 'cart.php',
            data: {id: ids.join(), key: (new Date).getTime()},
            success: function(res) {
                wx.hideToast();
                that.processData(res.data);
            },
            fail: function() {
                wx.hideToast();
                that.setData({
                    empty: true
                })
            }
        })
    },
    processData: function(data) {
        var cart = app.getCart(),
            _cart = {},
            total = 0;

        for (var i = 0; i < data.length; i++) {
            var num = cart[data[i].id];
            if (num) {
                data[i].num = num;
                data[i].disabled = num == data[i].min;
                data[i].unit = app.unit[data[i].unitId];
                _cart[data[i].id] = num;
                total += num;
            }
        }

        app.setCart(_cart);
        this.setData({
            empty: total == 0,
            cart: data,
            total: total
        })
    },
    // 删除
    del: function(e) {
        var that = this,
            id = e.currentTarget.dataset.id,
            cart = that.data.cart,
            _cart = app.getCart();

        wx.showModal({
            title: '提示',
            content: '确定要删除吗？',
            success: function(res) {
                if (res.confirm) {
                    var total = 0;
                    _cart[id] && delete _cart[id];
                    for (var i = 0; i < cart.length; i++) {
                        if (cart[i].id === id) {
                            cart.splice(i, 1);
                        } else {
                            total += cart[i];
                        }
                    }
                    app.setCart(_cart);
                    that.setData({
                        empty: total == 0,
                        cart: cart,
                        total: total
                    })
                }
            }
        })
    },
    // 输入数量
    quantityBlur: function(e) {
        var _cart = app.getCart();
        var cart = this.data.cart;
        var index = e.currentTarget.dataset.index;
        var currData = cart[index];
        var inputValue = Math.max(e.detail.value, currData.min);
        if (isNaN(inputValue)) {
            inputValue = currData.min;
        }
        currData.num = inputValue;
        currData.disabled = inputValue == currData.min;
        this.setData({
            cart: cart
        })
        _cart[currData.id] = inputValue;
        app.setCart(_cart);
        this.setData({
            total: app.total
        })
        return inputValue;
    },
    // 减少数量
    minus: function(e) {
        this.setNum(-1, e.currentTarget.dataset.index);
    },
    // 增加数量
    plus: function(e) {
        this.setNum(1, e.currentTarget.dataset.index);
    },
    // 存入数量
    setNum: function(increment, index) {
        var _cart = app.getCart();
        var cart = this.data.cart;
        var currData = cart[index];
        currData.num = Math.max(currData.num + increment, currData.min);
        currData.disabled = currData.num == currData.min;
        this.setData({
            cart: cart
        })
        _cart[currData.id] = currData.num;
        app.setCart(_cart);
        this.setData({
            total: app.total
        })
    },
    formSubmit: function(e) {
        console.log( e.detail.value);
        
        // 成功后清空购物车
        app.clearCart();
    }
})
