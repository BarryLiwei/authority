
import {loginByUserName, loginOut, getConsoleResource, getRoleId} from '../api/login/login';
import * as types from './mutation-type';

//提交修改状态
export default {
    LoginByUserName ({ commit }, userInfo) {
        // const username = userInfo.username.trim();
        return new Promise((resolve, reject) => {
            loginByUserName(userInfo.loginName, userInfo.password, userInfo.requestId).then(response => {
                commit(types['SAVE_USERINFO'], response.data);
                resolve(response);
            }).catch(error => {
                reject(error);
            });
        });
    },

    LoginOut ({ commit }) {
        // const username = userInfo.username.trim();
        return new Promise((resolve, reject) => {
            loginOut().then(response => {
                const data = response.data;
                commit(types['SAVE_LOGOUT'], data);
                resolve(data);
            }).catch(error => {
                reject(error);
            });
        });
    },
    GetConsoleResource ({ commit },parm) {
        // const username = userInfo.username.trim();
        return new Promise((resolve, reject) => {
            getConsoleResource(parm).then(response => {
                const data = response.data;
                commit(types['SAVE_CONSOLE_RESOURCE'], data);
                resolve(data);
            }).catch(error => {
                reject(error);
            });
        });
    },
    GetRoleId ({ commit },parm) {
        // const username = userInfo.username.trim();
        return new Promise((resolve, reject) => {
            getRoleId(parm.companyId).then(response => {
                const data = response.data;
                commit(types['SAVE_ROLEID'], data);
                resolve(data);
            }).catch(error => {
                reject(error);
            });
        });
    }

};
/*
* ,

 }*/