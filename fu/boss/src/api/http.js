import axios from 'axios'
import router from '@/router'
import * as api from '@/utils/api';
import * as lib from '@/utils/lib';

// axios 配置
axios.defaults.timeout = 5000;
axios.defaults.baseURL = 'http://10.0.3.31:8080'; // 王彬

// http request 拦截器
axios.interceptors.request.use(config => {
    config.headers = lib.getToken();
    config.headers['Content-Type'] = 'application/x-www-form-urlencoded;charset=UTF-8';
    return config;
}, err => {
    return Promise.reject(err);
});


// http response 拦截器
axios.interceptors.response.use(
    response => {
        if (response.data.status == 500) {
            api.Logout();
        }
        return response;
    },
    error => {
        api.Logout();
        return Promise.reject(error)
    });

export default axios;
