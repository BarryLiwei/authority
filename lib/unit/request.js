/**
 * Created by lijiashi on 3/24/2018.
 */
import axios from 'axios';
import qs from 'qs';
import { message } from './message-box';
import store from '@/store';
import * as Storage from '@/utils/storage';


const rootApi = 'http://dev.stars.ueb.cn/nginxrewrite';

var http = axios.create({
    timeout: '300000',
    headers: {
        "x-auth-token":''
    }
});

http.interceptors.request.use(config => {
    config.headers["x-auth-token"]= Storage.getSessionStorage('x-auth-token') ||'';
    store.commit('TOGGLE_LOADING', true);
    return config;
}, error => {
    console.log(error);
});

http.interceptors.response.use(response => {
    store.commit('TOGGLE_LOADING', false);
    if (response.data.retCode == '0006') {
        //router.push({'path': '/login'});
        localStorage.removeItem('userData');
    }
    return response;
}, error => {
    if (error.response.status === 401) {
        message({
            message: '登录状态已失效,请重新登录',
            type: 'warning',
            customClass: '',
            onClose: function () {
               // router.push({'path': '/login'});
        }});
        localStorage.removeItem('userData');
    } else if (error.response.status === 402) {
        message({
            message: '您的帐号已在其它地方登录',
            type: 'warning',
            customClass: '',
            onClose: function () {
               // router.push({'path': '/login'});
            }});
        localStorage.removeItem('userData');
    } else {
        console.log(error.response);
    }
    store.commit('TOGGLE_LOADING', false);
    return Promise.reject(error);
});

http.getAjax = function (url, params) {
    if (process.env.NODE_ENV == 'production') {
        return http.get(rootApi + url, {params: params});
    } else {
        return http.get(url, {params: params});
    }

};

http.postAjax = function (url, params, isJson) {
    if (process.env.NODE_ENV == 'production') {
        return isJson? http.post(rootApi + url, params): http.post(rootApi + url, qs.stringify(params));
    } else {
        return isJson? http.post(url, params): http.post(url, qs.stringify(params));
    }

};

http.exportGet = function (url, params) {
    url = process.env.NODE_ENV == 'production' ? rootApi + url : url
    return axios({
        method: 'get',
        responseType: 'blob',
        url,
        params : params // get 请求时带的参数
    })
};


export default http;

