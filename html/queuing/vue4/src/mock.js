//引入mockjs
const Mock = require('mockjs');
//使用mockjs模拟数据
//业务大类
Mock.mock('/api/list', (req, res) => {
    return {
        success: true,
        data: [{
            'name': '新车上牌',
            'key': '1'
        },{
            'name': '新车上牌',
            'key': '2'
        },{
            'name': '临时号牌',
            'key': '3'
        },{
            'name': '补牌补证',
            'key': '4'
        },{
            'name': '车辆转出/转入',
            'key': '5'
        },{
            'name': '车辆信息档案更正',
            'key': '6'
        },{
            'name': '车辆年审',
            'key': '7'
        },{
            'name': '车辆注销',
            'key': '8'
        },{
            'name': '辖区内转移登记',
            'key': '9'
        }]
    }
})
// 业务小类
Mock.mock('/api/data', (req, res) => {
    return {
        success: true,
        data: [{
            'name': '国产新车',
            'key': '11'
        },{
            'name': '进口新车',
            'key': '12'
        }]
    }
})

// 业务资料
Mock.mock('/api/pic', (req, res) => {
    return {
        success: true,
        data: [{
            'src': 'static/uploads/1.jpg',
            'alt': '身份证'
        }, {
            'src': 'static/uploads/2.jpg',
            'alt': '身份证'
        }, {
            'src': 'static/uploads/3.jpg',
            'alt': '身份证'
        }, {
            'src': 'static/uploads/4.jpg',
            'alt': '身份证'
        }, {
            'src': 'static/uploads/5.jpg',
            'alt': '身份证'
        }, {
            'src': 'static/uploads/6.jpg',
            'alt': '身份证'
        }]
    }
})

// 取票信息
Mock.mock('/api/ticket', (req, res) => {
    return {
        success: true,
        data: {
            'windows': '一楼13号窗口M110号',
            'waitNumber': '22',
            'name': '国产新车'
        }
    }
})

