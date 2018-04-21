import axios from 'axios'
import router from '@/router'

import Mock from '@/mock'
Mock.bootstrap();

// axios 配置
axios.defaults.timeout = 10000;
// axios.defaults.baseURL = 'http://10.0.3.31:8080'; // 王彬
axios.defaults.baseURL = 'http://localhost/api'; // 本地
// axios.defaults.withCredentials = true //允许跨域

// axios.options.headers = {
//   'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
// };


// http request 拦截器
axios.interceptors.request.use(
    config => {
        const token = Cookies.get('token');
        if (token) {
            config.headers.Authorization = token;
        }
        return config;
    },
    err => {
        return Promise.reject(err);
    }
);

// http response 拦截器
axios.interceptors.response.use(
    response => {
        return response;
    },
    error => {
        // console.log(error)
        if (error.response) {
            switch (error.response.status) {
                case 401:
                    Cookie.remove(token);
                    router.push({path: '/login'});
                    break;
            }
        }
        return Promise.reject(error.response.data)
    });

export default axios;
