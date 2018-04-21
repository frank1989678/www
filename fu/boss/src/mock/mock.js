import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import Mock from 'mockjs';

import * as data from './data';

let _Users = data.Users;
let _Admin = data.Admin;
let _GameList = data.GameList;

export default {
	bootstrap() {
		let mock = new MockAdapter(axios);

		// mock success request
		mock.onGet('/success').reply(200, {
			msg: 'success'
		});

		// mock error request
		mock.onGet('/error').reply(500, {
			msg: 'failure'
		});

		//登录
		mock.onPost('/login').reply(config => {
			let { username, password } = qs.parse(config.data);
			var success = {
				status: 200,
				msg: '登录成功',
				data: {
					"id": 1, //用户ID
					"name": "管理员",
					"username": "admin",
					"password": null,
					"salt": null,
					"status": 1,
					"createTime": 1524044149000,
					"updateTime": 1524044151000
				}
			}
			var error = {
				status: 500,
				msg: '账号或密码错误',
				data: null
			}
			return new Promise((resolve, reject) => {
				if (username === 'admin' && password === '123456') {
					resolve([200, success]);
				} else {
					resolve([200, error]);
				}
			});
		});

		//获取用户列表（分页）
		mock.onGet('/user/list').reply(config => {
			let {
				page,
				name
			} = config.params;
			let mockUsers = _Users.filter(user => {
				if (name && user.id.indexOf(name) == -1) return false;
				return true;
			});
			let total = mockUsers.length;
			mockUsers = mockUsers.filter((u, index) => index < 20 * page && index >= 20 * (page - 1));
			return new Promise((resolve, reject) => {
				resolve([200, {
					total: total,
					users: mockUsers
				}]);
			});
		});

		//修改用户
		mock.onPost('/user/edit').reply(config => {
			const { id } = qs.parse(config.data);
			_Users.some(u => {
		        if (u.id == id) {
		        	u.enabled = u.enabled == 1 ? 0 : 1;
					return true;
		        }
	      	});
			return new Promise((resolve, reject) => {
				resolve([200, {
					code: 200,
					msg: '修改成功'
				}]);
			});
		});

		//删除用户
		mock.onGet('/user/remove').reply(config => {
			let {
				id
			} = config.params;
			_Users = _Users.filter(u => u.id !== id);
			return new Promise((resolve, reject) => {
				setTimeout(() => {
					resolve([200, {
						code: 200,
						msg: '删除成功'
					}]);
				}, 500);
			});
		});

		//批量删除用户
		mock.onGet('/user/batchremove').reply(config => {
			let {
				ids
			} = config.params;
			ids = ids.split(',');
			_Users = _Users.filter(u => !ids.includes(u.id));
			return new Promise((resolve, reject) => {
				setTimeout(() => {
					resolve([200, {
						code: 200,
						msg: '删除成功'
					}]);
				}, 500);
			});
		});



		//获取管理员列表（分页）
		mock.onGet('/user/admin').reply(config => {
			let { page, name, date } = config.params;
			let mockAdmin = _Admin.filter(user => {
				if (name && user.username.indexOf(name) == -1) return false;
				return true;
			});
			let total = mockAdmin.length;
			mockAdmin = mockAdmin.filter((u, index) => index < 20 * page && index >= 20 * (page - 1));
			return new Promise((resolve, reject) => {
				resolve([200, {
					total: total,
					users: mockAdmin
				}]);
			});
		});

		//新增管理员
		mock.onPost('/user/adminAdd').reply(config => {
			const {username, cname, mobile } = qs.parse(config.data);
			_Admin.unshift({
				id 			  : Math.ceil(Math.random() * 1e4),
				username      : username,
				cname         : cname,
				mobile        : mobile,
				regTime       : Mock.Random.datetime(),
				regIp         : Mock.mock(/^2\d{2}\.\d{3}\.\d{3}\.\d{3}$/),
				lastLoginTime : Mock.Random.datetime(),
				lastLoginIp   : Mock.mock(/^2\d{2}\.\d{3}\.\d{3}\.\d{3}$/)
			});
			return new Promise((resolve, reject) => {
				resolve([200, {
					status: 200,
					msg: '添加成功'
				}]);
			});
		});

		//修改管理员
		mock.onPost('/user/adminEdit').reply(config => {
			const { id, username, cname, mobile } = qs.parse(config.data);
			_Admin.some(u => {
		        if (u.id == id) {
					u.username = username;
					u.cname = cname;
					u.mobile = mobile;
					return true;
		        }
	      	});
			return new Promise((resolve, reject) => {
				resolve([200, {
					status: 200,
					msg: '修改成功'
				}]);
			});
		});

		//删除管理员
		mock.onPost('/user/adminDel').reply(config => {
			const { id } = qs.parse(config.data);
			_Admin = _Admin.filter(u => u.id != id);
			return new Promise((resolve, reject) => {
				resolve([200, {
					status: 200,
					msg: '修改成功'
				}]);
			});
		});



		//获取游戏列表（分页）
		mock.onGet('/game/list').reply(config => {
			let { page, status } = config.params;
			let mockGameList = _GameList.filter(user => {
				if (name && user.username.indexOf(name) == -1) return false;
				return true;
			});
			let total = mockGameList.length;
			mockGameList = mockGameList.filter((u, index) => index < 20 * page && index >= 20 * (page - 1));
			return new Promise((resolve, reject) => {
				resolve([200, {
					total: total,
					list: mockGameList
				}]);
			});
		});

		//修改游戏状态
		mock.onPost('/game/gameEdit').reply(config => {
			const { id } = qs.parse(config.data);
			_GameList.some(u => {
		        if (u.id == id) {
		        	u.status = !u.status;
					return true;
		        }
	      	});
			return new Promise((resolve, reject) => {
				resolve([200, {
					code: 200,
					msg: '修改成功'
				}]);
			});
		});

	}
};