let base = '';
import router from '@/router'

// 登录
export const postLogin = params => { return axios.post(`${base}/login`, params).then(res => res.data)};
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
    // sessionStorage.setItem('user', JSON.stringify(data.id));
}

// 用户
export const getUserList = params => { return axios.get(`${base}/user/list`, { params: params }).then(res => res.data)};
export const postEditUser = params => { return axios.post(`${base}/user/edit`, qs.stringify(params)).then(res => res.data)};

// 管理员
export const getAdminList = params => { return axios.get(`${base}/user/admin`, { params: params }).then(res => res.data)};
export const postAddAdmin = params => { return axios.post(`${base}/user/adminAdd`, qs.stringify(params)).then(res => res.data)};
export const postEditAdmin = params => { return axios.post(`${base}/user/adminEdit`, qs.stringify(params)).then(res => res.data)};
export const postDelAdmin = params => { return axios.post(`${base}/user/adminDel`, qs.stringify(params)).then(res => res.data)};
