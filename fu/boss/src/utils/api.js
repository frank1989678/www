import router from '@/router';
export const baseURL = process.env.BASE_API;
// export const baseURL = 'http://10.0.3.74:8081';

export function fetch(url, params) {
    return new Promise((resolve, reject) => {
        axios.post(url, qs.stringify(params))
        .then(res => {
            resolve(res.data);
        }, err => {
            // reject(err);
        })
    })
}

// 登录
export const postLogin = params => { return fetch('/login', params) };


// 上传图片
export const upfile = params => { return fetch('/api/v1/global/upload', params) };

// 用户
export const getUserList = params => { return fetch('/api/v1/user/list', params) };
export const lockUser = params => { return fetch('/api/v1/user/lock', params) };
export const unLockUser = params => { return fetch('/api/v1/user/unlock', params) };
export const addUser = params => { return fetch('/api/v1/user/save', params) };

// 管理员
export const getAdminList = params => { return fetch('/api/v1/admin/list', params) };
export const postAddAdmin = params => { return fetch('/api/v1/admin/save', params) };
export const postEditAdmin = params => { return fetch('${base}/user/adminEdit', params) };
export const postDelAdmin = params => { return fetch('${base}/user/adminDel', params) };

// 内容管理
export const getCategory = params => { return fetch('/api/v1/category/list', params) };
export const saveCategory = params => { return fetch('/api/v1/category/save', params) };
export const delCategory = params => { return fetch('/api/v1/category/del', params) };
export const getCategoryInfo = params => { return fetch('/api/v1/category/query', params) };
// 内容管理=>销售方式
export const addSalesMode = params => { return fetch('/api/v1/category/salesmode/create', params) };
export const delSalesMode = params => { return fetch('/api/v1/category/salesmode/delete', params) };
// 内容管理=>段位配置
export const addDan = params => { return fetch('/api/v1/category/dan/create', params) };
export const delDan = params => { return fetch('/api/v1/category/dan/delete', params) };
// 内容管理=>标签配置
export const addTag = params => { return fetch('/api/v1/tag/category/create', params) };
export const delTag = params => { return fetch('/api/v1/tag/del', params) };

// 标签管理
export const getTagList = params => { return fetch('/api/v1/tag/list', params) };
export const saveTagList = params => { return fetch('/api/v1/tag/group/save', params) };
export const saveTagPerson = params => { return fetch('/api/v1/tag/person/save', params) };
export const getTagInfo = params => { return fetch('/api/v1/tag/group/query', params) };


// 用户信息认证管理
export const getVerityList = params => { return fetch('/api/v1/user/info-auth/list', params) };
// 手机号查询用户信息
export const getVerityByMobile = params => { return fetch('/api/v1/user/get', params) };
// 查询用户认证信息
export const getVerityById = params => { return fetch('/api/v1/user/info-auth/query', params) };

// 创建、修改用户认证信息
export const saveVerityInfo = params => { return fetch('/api/v1/user/info-auth/save', params) };
// 删除用户信息图片
export const delIdcardImg = params => { return fetch('/api/v1/user/info-auth/idcard/delete', params) };



// 查询用户技能信息
export const getSkillById = params => { return fetch('/api/v1/user/tech-auth/query', params) };
// 查询游戏列表
export const getGameList = params => { return fetch('/api/v1/category/list-all', params) };
// 查询游戏下所有标签
export const getGameTag = params => { return fetch('/api/v1/category/tag/list', params) };
// 查询游戏下所有段位
export const getGameDan = params => { return fetch('/api/v1/category/dan/list', params) };
// 用户技能列表
export const getSkillList = params => { return fetch('/api/v1/user/tech-auth/list', params) };
// 创建技能
export const saveSkill = params => { return fetch('/api/v1/user/tech-auth/save', params) };

// 查询提现列表
export const getWalletList = params => { return fetch('/api/v1/cashDraws/list', params) };
export const addDraw = params => { return fetch('/api/v1/cashDraws/draw', params) };

// 加零钱
export const getMoneyList = params => { return fetch('/api/v1/moneyDetails/list', params) };
export const addMoney = params => { return fetch('/api/v1/moneyDetails/save', params) };

// 订单筛选
export const getStatusList = params => { return fetch('/api/v1/order/status-all', params) };
export const getOrderList = params => { return fetch('/api/v1/order/list', params) };

