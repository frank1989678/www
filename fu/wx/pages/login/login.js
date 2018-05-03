// pages/login/login.js
const _lib = require('../../lib/lib.js');
const _reg = require('../../lib/reg.js');
const _api = require('../../lib/api.js');

Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		mobile: '',
		code: '',
		lock: false,
		disabled: true,
		btnText: '获取验证码'
	},

	// 检测输入有效性
	checkValid: function() {
		const disabled = _reg.isMobile(this.data.mobile) && this.data.code.length > 0;
		this.setData({
			disabled: !disabled
		})
	},

	// 手机号数据绑定
	mobileInput: function(e) {
		this.setData({
			mobile: e.detail.value
		})
		// this.checkValid();
	},

	// 验证码数据绑定
	codeInput: function(e) {
		this.setData({
			code: e.detail.value
		})
		// this.checkValid();
	},

	// 发送验证码
	sendCode: function() {
		var that = this;
		var mobile = that.data.mobile;
		if (that.data.lock) {
			// 验证码发送冷却中...
		} else if (mobile.length === 0) {
			_lib.showMsg('请输入手机号');
		} else if (!_reg.isMobile(mobile)) {
			_lib.showMsg('手机号格式错误');
		} else {
			that.setData({
				lock: true
			})
			_lib.showMsg('验证码发送中...');
			_lib.ajax(_api.SMS, {mobile: mobile}, function(res) {
				_lib.showMsg(res.msg);
				if (res.status === 200) {
					that.lockSMS(60);
				} else {
					that.setData({
						lock: false
					})
				}
			},function(err) {
				_lib.showMsg('网络错误，请稍后再试');
				that.setData({
					lock: false
				})
			})
		}
	},

	lockSMS: function(second) {
		var that = this;
		var defaultText = this.data.btnText;
		that.setData({
			btnText: second + 's'
		})
		var timer = setInterval(function() {
			second --;
			that.setData({
				btnText: second + 's'
			})
			if (second === 0) {
				clearInterval(timer);
				that.setData({
					lock: false,
					btnText: defaultText
				})
			}
		}, 1e3);
	},

	// 提交
	submitForm: function() {
		if (this.data.mobile.length === 0) {
			_lib.showMsg('请输入手机号');
		} else if (!_reg.isMobile(this.data.mobile)) {
			_lib.showMsg('手机号格式错误');
		} else if (this.data.code == '') {
			_lib.showMsg('请输入验证码');
		} else {
			let user = wx.getStorageSync('user') || {};
			user.mobile = this.data.mobile;
			user.verifyCode = this.data.code;
			let para = {
				nickName: user.nickName,
				avatarUrl: user.avatarUrl,
				gender: user.gender,
				language: user.language,
				city: user.city,
				province: user.province,
				country: user.country,
				mobile: this.data.mobile,
				verifyCode: this.data.code
			}

			_lib.ajax(_api.LOGIN, user, function(res) {
				_lib.showMsg(res.msg);
				// 判断是调到c端还是b端用户界面
				if (res.status === 200) {
					wx.reLaunch({
						url: '/pages/c/center/center'
					})
					// console.log('注册成功')
				}
			})
		}
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function(options) {

	}
})