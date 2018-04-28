// pages/register/register.js
var util = require('../../utils/util.js');
var validate = require('../../utils/validate.js');

Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		mobile: '',
		code: '',
		password: '',
		pwd2: '',
		nickname: '',
		lock: false,
		disabled: true,
		btnText: '获取验证码'

	},

	setDataVal: function(key, val) {
		this.setData({
			[key]: val
		})
	},

	// 检测输入有效性
	checkValid: function() {
		const disabled = validate.isMobile(this.data.mobile) 
				&& this.data.code.length > 0 
				&& this.data.password.length > 0 
				&& this.data.pwd2.length > 0
				&& this.data.nickname.length > 0
		this.setData({
			disabled: !disabled
		})
	},

	// 绑定数据
	changeInput: function(e) {
		const key = e.target.id;
		this.setData({
			[key]: e.detail.value
		})
		// this.setDataVal(key, e.detail.value);

		this.checkValid();
	},

	// 发送验证码
	sendCode: function() {
		var that = this;
		var mobile = that.data.mobile;
		if (that.data.lock) {
			// 验证码发送冷却中...
		} else if (mobile.length === 0) {
			util.showMsg('请输入手机号');
		} else if (!validate.isMobile(mobile)) {
			util.showMsg('手机号格式错误');
		} else {
			that.setData({
				lock: true
			})
			util.showMsg('验证码发送中...');
			util.ajax({
				url: util.baseURl + 'login.php',
				data: {
					mobile: mobile
				},
				success: function(res) {
					if (res.data.status === 200) {
						util.showMsg('验证码发送成功 :)');
						that.lockSMS(5);
					} else {
						util.showMsg('验证码发送失败 :(');
						that.setData({
							lock: false
						})
					}
				},
				error: function(res) {
					util.showMsg('网络错误，请稍后再试');
					that.setData({
						lock: false
					})
				}
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
			second--;
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
		if (!validate.isMobile(this.data.mobile)) {
			util.showMsg('手机号格式错误');
		} else if (this.data.password !== this.data.pwd2) {
			util.showMsg('两次输入的密码不一致');
		} else {
			const para = {
				mobile: this.data.mobile,
				code: this.data.code,
				password: this.data.password,
				nickname: this.data.nickname
			}
			console.log(para);
			util.ajax({
				url: util.baseURl + 'login.php',
				data: para,
				success: function(res) {
					util.showMsg(res.msg);
					if (res.data.status === 200) {
						console.log('注册成功')
					}
				}
			})
		}
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function(options) {

	},

	/**
	 * 生命周期函数--监听页面初次渲染完成
	 */
	onReady: function() {

	},

	/**
	 * 生命周期函数--监听页面显示
	 */
	onShow: function() {

	},

	/**
	 * 生命周期函数--监听页面隐藏
	 */
	onHide: function() {

	},

	/**
	 * 生命周期函数--监听页面卸载
	 */
	onUnload: function() {

	},

	/**
	 * 页面相关事件处理函数--监听用户下拉动作
	 */
	onPullDownRefresh: function() {

	},

	/**
	 * 页面上拉触底事件的处理函数
	 */
	onReachBottom: function() {

	},

	/**
	 * 用户点击右上角分享
	 */
	onShareAppMessage: function() {

	}
})