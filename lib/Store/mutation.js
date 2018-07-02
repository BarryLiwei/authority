
import * as types from './mutation-type';
import * as Storage from '@/utils/storage';
import {setCookie} from "../assets/js/cookie";

// import { navSystemRouterConfig, tagRouterShow } from '@/router/routeConfig'

//修改状态的方法
export default {
    [types.SAVE_TOGGLE_SYSTEM] (state, sysInfo) {
        state.showSystem = sysInfo;
    },
    [types.TOGGLE_LOADING] (state, flag) {
        state.showLoading = flag;
    },
    [types.SAVE_USERINFO] (state, data) {
        state.userInfo = {};
        state.userInfo = data.body;
        Storage.setSessionStorage('userInfo', JSON.stringify(data.body));
    },
    [types.SAVE_LOGOUT] (state) {
        state.userInfo = {};
        Storage.removeSessionStorage('userInfo');
        Storage.removeSessionStorage('consoleResource');
        Storage.removeSessionStorage('getSystemList');
        Storage.removeSessionStorage('roleId');
    },
    [types.SAVE_CONSOLE_RESOURCE] (state, data) {
        state.consoleResource = {};
        Storage.setSessionStorage('consoleResource', JSON.stringify(data.body));
    },
    [types.SAVE_ROLEID] (state, data) {
        state.roleId = '';
        Storage.setSessionStorage('roleId', data);
    },
    // 添加tabs
    add_tabs(state,data) {
        this.state.options.push(data);
        Storage.setSessionStorage('options',JSON.stringify(state.options));
    },
    // 删除tabs
    delete_tabs (state, route) {
        let index = 0;
        for (let option of state.options) {
            if (option.route === route) {
                break;
            }
            index++;
        }
        this.state.options.splice(index, 1);
        Storage.setSessionStorage('options',JSON.stringify(state.options));
    },
    // 设置当前激活的tab
    set_active_index (state, index) {
        this.state.activeIndex = index;
    },
    // 设置详情信息
    save_detail_info (state, info) {
        this.state.userInfoShow = info;
    },
}





