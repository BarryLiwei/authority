import Table from '../lib/Table/Table.vue'

export default{
    install(Vue , options){
       /**
        * Ueb 请求资源
        * 
        * @param {请求参数} options 
        */
        Vue.prototype.$request=function(options){

        }
        /**
         * UEB 登录方法
         * @param {*} options 
         */
        Vue.prototype.$login=function(options){
            
        }
        /**
         * UEB 退出登录
         * @param {*} options 
         */
        Vue.prototype.$logout=function(options){

        }

        Vue.component('ueb-table',Table)
    }
}