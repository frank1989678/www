//app.js
var _http = require('utils/util.js');

App({
	globalData: {
		userInfo: null,
		ajaxUrl: '',
		baseUrl: _http.baseUrl,
	},
	userInfo: function() {
		wx.getUserInfo({
			withCredentials: false,
			success: res => {
				this.globalData.user = res.userInfo;

				wx.setStorageSync('user', res.userInfo);

				// 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
				// 所以此处加入 callback 以防止这种情况
				if (this.userInfoReadyCallback) {
					this.userInfoReadyCallback(res)
				}
			},
			fail: err => {
				wx.showModal({
					title: '警告',
					content: '您点击了拒绝授权，将无法正常使用******的功能体验。请10分钟后再次点击授权，或者删除小程序重新进入。'
				}) 
			}
		})
	},
	userInfoReadyCallback: function(res) {
		// 发送用户信息后台
		_http.ajax('/postUserInfo', {userInfo: res.userInfo}, function(res) {
			if (res.status == 1) {
				// 判断是否是新用户
				// reLaunch, redirectTo
				wx.reLaunch({
					url: '/pages/login/login'
				})
			}
		});
	},
	login: function() {
		wx.login({
			success: res => {
				if (res.code) {
					// 发送 res.code 到后台换取 openId, sessionKey, unionId
					_http.ajax('/api/v1/user/login', {code: res.code}, function(res) {
						// console.log(res)
						wx.setStorageSync('token', res.token);
					})
					this.userInfo();
				} else {
					setTimeout( res => {
						this.login();
					}, 1e3);
				}
			}
		})
	},
	checkLogin: function() {
		wx.checkSession({
			success: res => {
				if (wx.getStorageSync('token')) {
					this.globalData.user = wx.getStorageSync('user');
				} else {
					// this.login();
				}
				//session_key 未过期，并且在本生命周期一直有效
			},
			fail: err => {
				this.globalData.user = '';
				// session_key 已经失效，需要重新执行登录流程
				this.login();
			}
		})
	},
	onLaunch: function() {
		this.checkLogin()
	}
})