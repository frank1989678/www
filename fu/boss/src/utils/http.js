import axios from 'axios'
import * as api from '@/utils/api';
import * as lib from '@/utils/lib';
import { Message } from 'element-ui';

// axios 配置
axios.defaults.timeout = 5000;
axios.defaults.baseURL = api.baseURL;

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
        // console.log('拦截器未生效：' + response);
        if (response.data.status == 501) {
            lib.logout();
        }
        return response;
    },
    err => {
        if (err && err.response) {
            switch (err.response.status) {
                case 400: err.message = '请求错误(400)' ; break;
                case 403: err.message = '拒绝访问(403)'; break;
                case 404: err.message = '请求出错(404)'; break;
                case 408: err.message = '请求超时(408)'; break;
                case 500: err.message = '服务器错误(500)'; break;
                case 501: err.message = '未授权，请重新登录(501)'; lib.logout(); break;
                case 502: err.message = '网络错误(502)'; break;
                case 503: err.message = '服务不可用(503)'; break;
                case 504: err.message = '网络超时(504)'; break;
                case 505: err.message = 'HTTP版本不受支持(505)'; break;
                default: err.message = '未知错误';  break;
            }
        } else {
            err.message = '连接服务器失败!'
        }
        Message.error(err.message);
        return Promise.reject(err.response);
    })

export default axios;
