// const baseUrl = 'http://ms676p.natappfree.cc';
// const baseUrl = 'http://10.0.3.74:8080'; // 颜彪
const baseUrl = 'http://10.0.3.31:8082'; // 王彬

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
	wx.navigateBack();
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
	return token || '';
}

function postLogin(code) {
	ajax('/login', {code: code}, function(res) {
		const token = res.data && res.data.token || 'notoken';
		wx.setStorageSync('token', token);

		if (res.status === 200) {
			wx.setStorageSync('isLogin', 'true');
			wx.setStorageSync('times', 0);
		} else if (res.status === 201) {
			wx.setStorageSync('times', 0);
			// 新用户，注册并并附带发送 userInfo信息给后台创建新用户
			wx.redirectTo({
				url: '/pages/login/login'
			})
		} else {
			wx.setStorageSync('isLogin', 'true');
			console.log('登录异常，可能是code使用频繁导致');
		}
	})
}

function getUserInfo(code) {
	wx.getUserInfo({
		success: res => {
			let userInfo = res.userInfo;
			wx.setStorageSync('user', userInfo);
			wx.setStorageSync('myUsername', userInfo.nickName);	
			postLogin(code);
		},
		fail: err => {
			wx.showModal({
				title: '警告',
				content: '您点击了拒绝授权，将无法正常使用正常体验功能。请10分钟后再次点击授权，或者删除小程序重新进入。'
			}) 
		}
	})
}

function login() {
	const isLogin = wx.getStorageSync('isLogin');
	const times = wx.getStorageSync('times') || 0;
	testLogin(); // 临时登录测试
	return;
	if (times >= 3) {
		// 登录次数限制
	} else if (!isLogin) {
		wx.setStorageSync('times', times + 1);
		wx.login({
			success: function(res) {
				res.code && getUserInfo(res.code);
			}
		})
	}
}

function testLogin() {
	ajax('/test/login', {
		openId: '234567',
		openId: '123456'
	}, function(res) {
		const token = res.data && res.data.token || 'notoken';
		wx.setStorageSync('token', token);
	})
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
				login();
			}
			wx.hideLoading();
		}
	});
}

function getAstro(month, day) {
	var s = "魔羯水瓶双鱼牡羊金牛双子巨蟹狮子处女天秤天蝎射手魔羯";
	var arr = [20, 19, 21, 21, 21, 22, 23, 23, 23, 23, 22, 22];
	return s.substr(month * 2 - (day < arr[month - 1] ? 2 : 0), 2);
}

function formatSex(type) {
	return type == 1 ? '男' : type == 2 ? '女' : '未知';
}

module.exports = {
	trim: trim,
	baseUrl: baseUrl,
	ajax: ajax,
	login: login,
	goback: goback,
	showMsg: showMsg,
	getToken: getToken,
	getAstro: getAstro,
	formatSex: formatSex,
	formatTime: formatTime
}