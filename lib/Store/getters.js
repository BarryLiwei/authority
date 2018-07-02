import * as Storage from '@/utils/storage';

const getters = {
    showLoading: state => state.showLoading,
    departmentList: state => state.staging.departmentList,
    staffInfo: state => state.staging.staffInfo,
    companyId: state => state.staging.companyId,
    postInfo: state => state.staging.postInfo,
    roleInfo: state => state.staging.roleInfo,
    userInfo: state => state.userInfo,
    consoleResource: state => state.consoleResource
};

export default getters