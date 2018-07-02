import Table from '../lib/Table/main'
import Search from '../lib/Search/main'
import Tab from '../lib/Tab/main'
import Login from '../lib/Login/login'
import Diglod from '../lib/Prpup/main'
import Layout from '../lib/Layout/layout'

export default{
    install(Vue , options){
       /**
        * Ueb 请求资源
        * 
        * @param {请求参数} options 
        */
        Vue.prototype.$request=function(options){

        }

        Vue.component(Table.name, Table)
        
        Vue.component(Search.name, Search)

        Vue.component(Tab.name, Tab)

        Vue.component(Login.name, Login)
		
		Vue.component(Diglod.name, Diglod)
		
		Vue.component(Layout.name, Layout)

    }
}