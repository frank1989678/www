// pages/login/login.js
const app = getApp();
const baseUrl = app.data.baseUrl;
Page({
	data: {
		user: '',
		password: '',
		btnActive: false, // 按钮状态
		token: '', //方便存在本地的locakStorage  
		response: '' //存取返回数据  
	},

	onMobileInput: function(e) {
		this.setData({
			user: e.detail.value
		})
		this.onCheckForm();
	},
	onPasswordInput: function(e) {
		this.setData({
			password: e.detail.value
		})
		this.onCheckForm();
	},
	onCheckForm: function() {
		this.setData({
			btnActive: this.data.user !== '' && this.data.password !== ''
		})
	},
	onSubmitLoginForm: function() {
		var that = this;
		if (this.data.btnActive !== true) {
			return;
		}
		if (this.data.user === '') {
			wx.showToast({
				title: '请输入手机号',
				icon: 'none'
			})
		} else if (this.data.password === '') {
			wx.showToast({
				title: '请输入密码',
				icon: 'none'
			})
		} else {
			wx.showToast({
				title: '加载中',
				icon: 'loading',
				duration: 1e4
			})
			wx.request({
				url: baseUrl + 'login.php',
				data: {
					username: this.data.user,
					password: this.data.password,
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
	goRegister: function() {
		// reLaunch, redirectTo
		wx.reLaunch({
			url: '/pages/register/register'
		})
	},
	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function(options) {

	}
})