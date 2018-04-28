const baseUrl = 'http://10.0.3.74:8080';

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
				doSuccess(res);
			}
		},
		fail: function(err) {
			if (typeof doFail === 'function') {
				doFail();
			}
			// 未登录提示
			if (err.code === 500) {
				wx.removeStorageSync('isLogin')
			}
		},
		complete: function() {
			if (typeof doComplete === 'function') {
				doComplete();
			}
			wx.hideLoading();
		}
	});
}

module.exports = {
	trim: trim,
	baseUrl: baseUrl,
	ajax: ajax,
	showMsg: showMsg,
	getToken: getToken,
	formatTime: formatTime
}