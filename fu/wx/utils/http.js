var baseUrl = 'http://10.0.3.74:8080';

function getToken() {
	var token = wx.getStorageSync('token');
	return token;
}

function ajax(url, params, doSuccess, doFail, doComplete) {
	var token = getToken();
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
		fail: function() {
			if (typeof doFail === 'function') {
				doFail();
			}
		},
		complete: function() {
			if (typeof doComplete === 'function') {
				doComplete();
			}
		}
	});
}

module.exports.ajax = ajax;
module.exports.getToken = getToken;
module.exports.baseUrl = baseUrl;