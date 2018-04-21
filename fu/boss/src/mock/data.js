import Mock from 'mockjs';
const LoginUsers = [
  {
    username: 'admin',
    password: '123456'
  }
];

const Users = [];

for (let i = 0; i < 86; i++) {
  Users.push(Mock.mock({
    id: Mock.Random.guid(),
    id: /^\d{4}$/,
    mobile: /^1\d{10}$/,
    regTime: Mock.Random.datetime(),
    regIp: /^2\d{2}\.\d{3}\.\d{3}\.\d{3}$/,
    nickName: Mock.Random.cname(),
    lastLoginIp: /^2\d{2}\.\d{3}\.\d{3}\.\d{3}$/,
    lastLoginTime: Mock.Random.datetime(),
    isPlayer: Mock.Random.integer(0, 1),
    cost: Mock.Random.integer(0, 100),
    orderCount: Mock.Random.integer(0, 100),
    enabled: Mock.Random.integer(0, 1)
  }));
}

const Admin = [];
for (let i = 0; i < 86; i++) {
  Admin.push(Mock.mock({
    id: /^\d{4}$/,
    username: /^[a-z][a-z0-9]{5}$/,
    mobile: /^1\d{10}$/,
    regTime: Mock.Random.datetime(),
    regIp: /^2\d{2}\.\d{3}\.\d{3}\.\d{3}$/,
    cname: Mock.Random.cname(),
    lastLoginIp: /^2\d{2}\.\d{3}\.\d{3}\.\d{3}$/,
    lastLoginTime: Mock.Random.datetime()
  }));
}

const GameList = [];
for (let i = 0; i < 86; i++) {
  GameList.push(Mock.mock({
    id: /^\d{4}$/,
    name: '王者荣耀',
    sort: 1,
    status: Mock.Random.boolean(),
    charges: Mock.Random.float(0, 1),
    icon: ''
  }));
}


export { LoginUsers, Users, Admin, GameList };