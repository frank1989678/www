const app = getApp();
const baseUrl = app.data.baseUrl;

Page({
	data: {
		score: '',
		count: '',
		income: '',
		price: '15',
		unitVal: '小时',
		gameList: [
			{'val': '绝地求生', 'key': '1', 'checked': '0'},
			{'val': '王者荣耀', 'key': '2', 'checked': '1'}
		]
	},
	onShow: function() {
		var that = this;
		wx.request({
			url: baseUrl + 'setting.json',
			data: {},
			method: 'GET',
			success: function(res) {
				that.setData({
					score: res.data.score,
				  	count: res.data.count,
				  	income: res.data.income
				})
			},
			fail: function(res) {
				console.log(res.msg);
			}
		})
	},
	onSwitch: function() {

	}
})