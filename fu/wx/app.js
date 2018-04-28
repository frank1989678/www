//app.js
const _lib = require('lib/lib.js');

App({
	globalData: {
		userInfo: null,
		ajaxUrl: '',
		baseUrl: _lib.baseUrl,
	},
	getUserInfo: function(code) {
		wx.removeStorageSync('isLogin');
		// 获取授权成功或失败后不会再次弹框，直接执行对应的回调
		wx.getUserInfo({
			withCredentials: true,
			success: res => {
				let userInfo = res.userInfo;
				userInfo.encryptedData = res.encryptedData;
				userInfo.iv = res.iv;
				userInfo.rawData = res.rawData;
				userInfo.signature = res.signature;
				wx.setStorageSync('user', userInfo);

				if (code) {
					// 发送 code 到后台换取 openId, sessionKey, unionId
					_lib.ajax('/login', {code: code}, function(res) {
						res = res.data;
						try {
							wx.setStorageSync('token', res.data.token);
						} catch(err) {} 
						if (res.status === 200) {
							wx.setStorageSync('isLogin', 'true');
						} else if (res.status === 201) {
							// 新用户，注册并并附带发送 userInfo信息给后台创建新用户
							wx.redirectTo({
								url: '/pages/login/login'
							})
						} else {
							wx.setStorageSync('isLogin', 'true');
							console.log('登录异常，可能是code使用频繁导致');
							// wx.redirectTo({
							// 	url: '/pages/login/login'
							// })
						}
					})
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
	checkLogin2: function() {
		wx.checkSession({
			success: res => {
				console.info('session_key 未过期');

				// 每次ajax请求，如果失败并且状态是500会清除token
				if (wx.getStorageSync('token')) {
				} else {
					this.login();
				}
				//session_key 未过期，并且在本生命周期一直有效
			},
			fail: err => {
				// session_key 已经失效，需要重新执行登录流程
				console.error('session_key 未过期');
				this.login();
			}
		})
	},

	login: function() {
		var that = this;
		// 太过频繁的登录会导致code无法被后台使用（微信的安全机制）
		// 用户登录凭证（有效期五分钟）。开发者需要在开发者服务器后台调用 api，使用 code 换取 openid 和 session_key 等信息
		wx.login({
			success: function(res) {
				// 先获取用户信息
				res.code && that.getUserInfo(res.code);
			}
		})
	},
	// 不使用小程序的session验证机制 
	checkLogin: function() {

		// 自定义验证机制，如果后端返回的接口提示需要登录就会清除（代码在lib.js的ajax：fail方法里面）
		if (!wx.getStorageSync('isLogin')) {
			this.login();
		}
	},
	onLaunch: function() {
		this.checkLogin()
	}
})