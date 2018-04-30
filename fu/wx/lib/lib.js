// const baseUrl = 'http://10.0.3.74:8080';
const baseUrl = 'http://ms676p.natappfree.cc';

const formatTime = date => {
	const year = date.getFullYear()
	const month = date.getMonth() + 1
	const day = date.getDate()
	const hour = date.getHours()
	const minute = date.getMinutes()
	const second = date.getSeconds()

	return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
	n = n.toString()
	return n[1] ? n : '0' + n
}

// 返回上一页
function goback() {
	// wx.navigateBack();
}

function trim(val) {
    return val ? val.toString().replace(/^\s+|\s+$/g, '') : '';
}

function showMsg(msg) {
	msg && wx.showToast({
		title: msg,
		icon: 'none'
	})
}

function getToken() {
	var token = wx.getStorageSync('token');
	return token;
}

function postLogin(code) {
	ajax('/login', {code: code}, function(res) {
		wx.setStorageSync('token', res.data.token || '');

		if (res.status === 200) {
			wx.setStorageSync('isLogin', 'true');

		} else if (res.status === 201) {
			// 新用户，注册并并附带发送 userInfo信息给后台创建新用户
			wx.redirectTo({
				url: '/pages/login/login'
			})
			wx.setStorageSync('custom', true);
		} else {
			wx.setStorageSync('isLogin', 'true');
			// console.log('登录异常，可能是code使用频繁导致');
		}
	})
}

function getUserInfo(code) {
	wx.getUserInfo({
		withCredentials: true,
		success: res => {
			let userInfo = res.userInfo;
			userInfo.encryptedData = res.encryptedData;
			userInfo.iv = res.iv;
			userInfo.signature = res.signature;
			wx.setStorageSync('user', userInfo);
			wx.setStorageSync('myUsername', userInfo.nickName);	
			postLogin(code);
		},
		fail: err => {
			wx.showModal({
				title: '警告',
				content: '您点击了拒绝授权，将无法正常使用******的功能体验。请10分钟后再次点击授权，或者删除小程序重新进入。'
			}) 
		}
	})
}

function goRegister() {
	// 新用户，注册并并附带发送 userInfo信息给后台创建新用户
	wx.redirectTo({
		url: '/pages/login/login'
	})
}

function login() {
	const custom = wx.getStorageSync('custom');
	const isLogin = wx.getStorageSync('isLogin');
	console.log(custom, isLogin)
	return;
	// custom在上线时要删掉，暂时因绑定接口不通，code请求太频繁而加到判断条件
	if (custom) {
		wx.redirectTo({
			url: '/pages/login/login'
		})
	} else if (isLogin) {
		// 已登录
	} else {
		wx.login({
			success: function(res) {
				res.code && getUserInfo(res.code);
			}
		})
	}
}


function ajax(url, params, doSuccess, doFail, doComplete) {
	var token = getToken();
	wx.showLoading();
	wx.request({
		url: baseUrl + url,
		data: params,
		header: {
			'content-type': 'application/x-www-form-urlencoded',
			token: token
		},
		dataType: 'json',
		method: 'POST',
		success: function(res) {
			if (typeof doSuccess === 'function') {
				doSuccess(res.data);
			}
		},
		fail: function(err) {
			if (typeof doFail === 'function') {
				doFail();
			}
		},
		complete: function(res) {
			if (typeof doComplete === 'function') {
				doComplete();
			}
			// 未登录提示
			if (res.data.status == 501) {
				wx.removeStorageSync('isLogin');
				wx.removeStorageSync('custom');
				login();
			}
			wx.hideLoading();
		}
	});
}

module.exports = {
	trim: trim,
	baseUrl: baseUrl,
	ajax: ajax,
	login: login,
	showMsg: showMsg,
	getToken: getToken,
	formatTime: formatTime
}