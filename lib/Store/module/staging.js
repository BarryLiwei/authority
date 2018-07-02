
import * as types from '../mutation-type';
import * as Storage from '@/utils/storage';

import {
    getSystemInfo,
    getCompanyInfo,
    getStaffInfo,
    getStaffPageInfo,
    getDepartmentOption,
    addStaffInfo,
    getPostOption,
    getRoleOption,
    getStaffOrSystemPageInfo,
    getStaffAndSysDetailInfo,
    getCompanySysInfoList,
    assignInfo
} from '@/api/staging';

const config = {
    state: {
        systemInfo: {},
        staffInfo: {},
        companyInfo: {},
        departmentList: [],
        companyId: '',
        roleInfo: '',
        postInfo: '',
        systemInfo: ''
    },
    mutations: {
        [types.SAVE_SYSTEM_INFO] (state, systemInfo) {
            state.systemInfo = systemInfo;
        },
        [types.SAVE_COMPANY_STAFF_INFO] (state, staffInfo) {
            // state.staffInfo = staffInfo;
        },
        [types.SAVE_COMPANY_LIST_INFO] (state, companyInfo) {
            state.companyInfo = companyInfo;
        },
        [types.SAVE_DEPARTMENT_LIST] (state, depList) {
            state.departmentList = depList;
        },
        [types.SAVE_STAFF_INFO_DETAIL] (state, staffInfo) {
            state.staffInfo = staffInfo;
        },
        [types.SAVE_COMPANYID] (state, companyId) {
            state.companyId = companyId;
        },
        [types.SAVE_POST_LIST] (state, postInfo) {
            state.postInfo = postInfo;
        },
        [types.SAVE_ROLE_LIST] (state, roleInfo) {
            state.roleInfo = roleInfo;
        },
        [types.SAVE_SYSTEM_FOF_COMPANY] (state, systemInfo) {
            state.systemInfo = systemInfo;
        }
    },
    actions: {
        GetSystemInfo ({ commit }, queryData) {
            if (!queryData) {
                queryData = {};
            }
            return new Promise((resolve, reject) => {
                getSystemInfo(queryData).then(response => {
                    if (response.data) {
                        if (response.data.body) {
                            Storage.setSessionStorage('getSystemList', JSON.stringify(response.data.body));
                        }
                    }
                    resolve(response.data);
                }).catch(error => {
                    reject(error);
                })
            })
        },
        GetCompanyInfo ({ commit }, queryData) {
            if (!queryData) {
                queryData = {}
            }
            return new Promise((resolve, reject) => {
                getCompanyInfo(queryData).then(response => {
                    resolve(response.data);
                }).catch(error => {
                    reject(error);
                })
            })
        },
        GetStaffInfo ({ commit }, queryData) {
            console.log(queryData);
            if (!queryData) {
                queryData = {};
            }
            return new Promise((resolve, reject) => {
                getStaffInfo(queryData).then(response => {
                    commit(types['SAVE_STAFF_INFO_DETAIL'], response.data.body);
                    resolve(response.data);
                }).catch(error => {
                    reject(error);
                })
            })
        },
        GetStaffPageInfo ({ commit }, queryData) {
            if (!queryData) {
                queryData = {
                    Pagination: {
                        pages: 1,
                        size: 20
                    }
                };
            }
            return new Promise((resolve, reject) => {
                getStaffPageInfo(queryData).then(response => {
                    resolve(response.data);
                }).catch(error => {
                    reject(error);
                })
            })
        },
        GetDepartmentOption ({ commit }, queryData) {
            if (!queryData) {
                queryData = {};
            }
            return new Promise((resolve, reject) => {
                getDepartmentOption(queryData).then(response => {
                    response.data.retCode === '0000' ? commit(types['SAVE_DEPARTMENT_LIST'], response.data.body || []) : [];
                    resolve(response.data);
                }).catch(error => {
                    reject(error);
                })
            })
        },
        GetPostOption ({ commit }, queryData) {
            if (!queryData) {
                queryData = {};
            }
            return new Promise((resolve, reject) => {
                getPostOption(queryData).then(response => {
                    commit(types['SAVE_POST_LIST'], response.data.body);
                    resolve(response.data);
                }).catch(error => {
                    reject(error);
                })
            })
        },
        GetRoleOption ({ commit }, queryData) {
            if (!queryData) {
                queryData = {};
            }
            return new Promise((resolve, reject) => {
                getRoleOption(queryData).then(response => {
                    commit(types['SAVE_ROLE_LIST'], response.data.body);
                    resolve(response.data);
                }).catch(error => {
                    reject(error);
                })
            })
        },
        GetStaffOrSystemPageInfo ({ commit }, queryData) {
            if (!queryData) {
                queryData = {};
            }
            return new Promise((resolve, reject) => {
                getStaffOrSystemPageInfo(queryData).then(response => {
                    // commit(types['SAVE_ROLE_LIST'], response.data.body);
                    resolve(response.data);
                }).catch(error => {
                    reject(error);
                })
            })
        },
        GetStaffAndSysDetailInfo ({ commit }, queryData) {
            if (!queryData) {
                queryData = {};
            }
            return new Promise((resolve, reject) => {
                getStaffAndSysDetailInfo(queryData).then(response => {
                    // commit(types['SAVE_ROLE_LIST'], response.data.body);
                    resolve(response.data);
                }).catch(error => {
                    reject(error);
                })
            })
        },
        GetCompanySysInfoList ({ commit }, queryData) {
            if (!queryData) {
                queryData = {};
            }
            return new Promise((resolve, reject) => {
                getCompanySysInfoList(queryData).then(response => {
                    // commit(types['SAVE_ROLE_LIST'], response.data.body);
                    resolve(response.data);
                }).catch(error => {
                    reject(error);
                })
            })
        }

    }
};

export default config;