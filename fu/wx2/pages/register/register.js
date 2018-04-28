// pages/login/login.js
Page({
	data: {
		mobile: '15926332570',
		code: '',
		password: '',
		pwd2: '',
		nickName: '',
		btnText: '获取验证码',
		delayTime: 60, // 验证码发送间隔
		time: 0,
		pass: false, // 按钮状态
		token: '', //方便存在本地的locakStorage  
		response: '' //存取返回数据  
	},

	onMobileInput: function(e) {
		this.setData({
			mobile: e.detail.value
		})
	},
	onCodeInput: function(e) {
		this.setData({
			code: e.detail.value
		})
	},
	onPasswordInput: function(e) {
		this.setData({
			password: e.detail.value
		})
	},
	onPasswordComfirm: function(e) {
		this.setData({
			pwd2: e.detail.value
		})
	},
	onNickNameInput: function(e) {
		this.setData({
			nickName: e.detail.value
		})
	},

	// 发送验证码
	onSendCode: function() {
		var that = this;
		var msg = '';

		if (that.data.time !== 0) {
			return;
		} else if (this.data.mobile === '') {
			msg = '请输入手机号';
		} else if (/^1\d{10}$/.test(this.data.mobile) === false) {
			msg = '手机号码错误';
		}
		if (msg) {
			wx.showToast({
				title: msg,
				icon: 'none'
			})
			return;
		}

		this.onAjaxCode();
	},

	onAjaxCode: function() {
		var that = this;
		wx.request({
			url: 'http://localhost/fu/wx/php/login.php',
			data: {
				mobile: this.data.mobile
			},
			method: 'GET',
			success: function(res) {
				if (res.data.code == 1) {
					that.ticker();
				}
			},
			fail: function(res) {
				console.log(res.msg);
			}
		})
	},

	ticker: function() {
		var that = this;
		var time = that.data.delayTime;
		that.setSecond(that.data.delayTime);
		var timer = setInterval(function() {
			time --;
			that.setSecond(time);
			if (time === 0) {
				clearInterval(timer);
			}
			that.setData({
				btnText: time === 0 ? '获取验证码' : time + 's'
			})
		}, 1e3);
	},

	setSecond: function(time) {
		this.setData({
			time: time
		})
	},

	// 验证表单
	onCheckForm: function() {
		var msg = '';
		var pass = false;
		if (this.data.mobile === '') {
			msg = '请输入手机号';
		} else if (/^1\d{10}$/.test(this.data.mobile) === false) {
			msg = '手机号码错误';
		} else if (this.data.code === '') {
			msg = '请输入手机验证码';
		} else if (this.data.password) {
			msg = '请输入密码';
		} else if (this.data.pwd2 != this.data.password) {
			msg = '两次输入的密码不一致';
		} else if (this.data.nickName === '') {
			msg = '请输入昵称';
		} else {
			pass = true;
		}

		if (msg) {
			wx.showToast({
				title: msg,
				icon: 'none'
			})
		}
		this.setData({
			pass: pass
		})
		return pass;
	},
	onSubmitRegisterForm: function() {
		var that = this;
		var pass = this.onCheckForm();
		if (pass) {
			wx.showToast({
				title: '加载中',
				icon: 'loading',
				duration: 1e4
			})
			wx.request({
				url: 'http://localhost/fu/wx/php/login.php',
				data: {
					mobile: this.data.mobile,
					code: this.data.code,
					password: this.data.password,
					nickName: this.data.nickName
				},
				method: 'GET',
				success: function(res) {
					var res = res.data;
					that.setData({
						token: res.data.token,
						response: res
					})
					wx.hideToast();
					try {
						wx.setStorageSync('token', res.data.token)
					} catch (e) {}
					// wx.navigateTo({
					//   url: '../components/welcome/welcome'
					// })
				},
				fail: function(res) {
					console.log(res.msg);
				}
			})
		}
	},
	goLogin: function() {
		wx.reLaunch({
			url: '/pages/login/login'
		})
	},
	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function(options) {

	}
})