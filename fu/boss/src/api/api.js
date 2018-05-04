import router from '@/router';

// 登录
export const postLogin = params => { return axios.post('/login', params).then(res => res.data)};
export const Logout = res => {
	// sessionStorage.setItem('user', JSON.stringify(data.id));

	if (res) {
		Cookies.set('token', res.token);
	    Cookies.set('sysUserName', res.sysUserName);
	    router.push({ path: '/user/list' });
	} else {
		Cookies.remove('token');
	    Cookies.remove('cName');
	    router.push({ path: '/login' });
	}
}

// 上传图片
export const upfile = params => { return axios.post('/api/v1/global/upload', qs.stringify(params)).then(res => res.data)};

// 用户
export const getUserList = params => { return axios.post('/api/v1/user/list', qs.stringify(params)).then(res => res.data)};
export const lockUser = params => { return axios.post('/api/v1/user/lock', qs.stringify(params)).then(res => res.data)};
export const unLockUser = params => { return axios.post('/api/v1/user/unlock', qs.stringify(params)).then(res => res.data)};

// 管理员
export const getAdminList = params => { return axios.post('/api/v1/admin/list', qs.stringify(params)).then(res => res.data)};
export const postAddAdmin = params => { return axios.post('/api/v1/admin/save', qs.stringify(params)).then(res => res.data)};
export const postEditAdmin = params => { return axios.post('${base}/user/adminEdit', qs.stringify(params)).then(res => res.data)};
export const postDelAdmin = params => { return axios.post('${base}/user/adminDel', qs.stringify(params)).then(res => res.data)};

// 内容管理
export const getCategory = params => { return axios.post('/api/v1/category/list', qs.stringify(params)).then(res => res.data)};
export const saveCategory = params => { return axios.post('/api/v1/category/save', qs.stringify(params)).then(res => res.data)};
export const delCategory = params => { return axios.post('/api/v1/category/del', qs.stringify(params)).then(res => res.data)};
export const getCategoryInfo = params => { return axios.post('/api/v1/category/query', qs.stringify(params)).then(res => res.data)};
// 销售方式
export const addSalesMode = params => { return axios.post('/api/v1/category/salesmode/create', qs.stringify(params)).then(res => res.data)};
export const delSalesMode = params => { return axios.post('/api/v1/category/salesmode/delete', qs.stringify(params)).then(res => res.data)};
// 段位配置
export const addDan = params => { return axios.post('/api/v1/category/dan/create', qs.stringify(params)).then(res => res.data)};
export const delDan = params => { return axios.post('/api/v1/category/dan/delete', qs.stringify(params)).then(res => res.data)};
// 标签配置
export const addTag = params => { return axios.post('/api/v1/tag/category/create', qs.stringify(params)).then(res => res.data)};
export const delTag = params => { return axios.post('/api/v1/tag/del', qs.stringify(params)).then(res => res.data)};

// 标签管理
export const getTagList = params => { return axios.post('/api/v1/tag/list', qs.stringify(params)).then(res => res.data)};
export const saveTagList = params => { return axios.post('/api/v1/tag/group/save', qs.stringify(params)).then(res => res.data)};
export const saveTagPerson = params => { return axios.post('/api/v1/tag/person/save', qs.stringify(params)).then(res => res.data)};
export const getTagInfo = params => { return axios.post('/api/v1/tag/group/info', qs.stringify(params)).then(res => res.data)};


// 用户信息认证管理
export const getVerityList = params => { return axios.post('/api/v1/user/info-auth/list', qs.stringify(params)).then(res => res.data)};
// 手机号查询用户信息
export const getVerityByMobile = params => { return axios.post('/api/v1/user/get', qs.stringify(params)).then(res => res.data)};
// 查询用户认证信息
export const getVerityById = params => { return axios.post('/api/v1/user/info-auth/query', qs.stringify(params)).then(res => res.data)};

// 创建、修改用户认证信息
export const saveVerityInfo = params => { return axios.post('/api/v1/user/info-auth/save', qs.stringify(params)).then(res => res.data)};
// 删除用户信息图片
export const delIdcardImg = params => { return axios.post('/api/v1/user/info-auth/idcard/delete', qs.stringify(params)).then(res => res.data)};



// 查询用户技能信息
export const getSkillById = params => { return axios.post('/api/v1/user/tech-auth/query', qs.stringify(params)).then(res => res.data)};
// 查询游戏列表
export const getGameList = params => { return axios.post('/api/v1/category/list-all', qs.stringify(params)).then(res => res.data)};
// 查询游戏下所有标签
export const getGameTag = params => { return axios.post('/api/v1/category/tag/list', qs.stringify(params)).then(res => res.data)};
// 查询游戏下所有段位
export const getGameDan = params => { return axios.post('/api/v1/category/dan/list', qs.stringify(params)).then(res => res.data)};
// 用户技能列表
export const getSkillList = params => { return axios.post('/api/v1/user/tech-auth/list', qs.stringify(params)).then(res => res.data)};
// 创建技能
export const saveSkill = params => { return axios.post('/api/v1/user/tech-auth/save', qs.stringify(params)).then(res => res.data)};

// 查询提现列表
export const getWalletList = params => { return axios.post('/api/v1/cashDraws/list', qs.stringify(params)).then(res => res.data)};