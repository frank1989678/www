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
			_lib.ajax('/api/v1/user/mobile/sms', {mobile: mobile}, function(res) {
				res = res.data;
				if (res.data.status === 200) {
					_lib.showMsg('验证码发送成功 :)');
					that.lockSMS(60);
				} else {
					_lib.showMsg('验证码发送失败 :(');
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
			let para = wx.getStorageSync('user') || {};
			para.mobile = this.data.mobile;
			para.verifyCode = this.data.code;

			_lib.ajax(_api.LOGIN, para, function(res) {
				console.log(res)
				_lib.showMsg(res.data.msg);
				// 判断是调到c端还是b端用户界面
				if (res.data.status === 200) {
					wx.reLaunch({
						url: '/pages/setting/setting'
					})
					console.log('注册成功')
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