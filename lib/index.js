import Table from '../lib/Table/main'
import Search from '../lib/Search/main'
import Tab from '../lib/Tab/main'
import Login from '../lib/Login/login'
import Diglod from '../lib/Prpup/main'
import Layout from '../lib/Layout/layout'
import Export from '../lib/export/main'
import Box from '../lib/Box/box'
import BoxItem from '../lib/Box/box-item'

import EditButton from '../lib/button/EditButton'
import SelectButton from '../lib/button/SelectButton'
import AddButton from '../lib/button/AddButton'
import ConfirmButton from '../lib/button/ConfirmButton'

import Textarea from '../lib/input/textarea'

import Cascade from '../lib/input/cascade'

import Assist from '../lib/unit/assist'

export default{
    install(Vue , options){
       /**
        * Ueb 请求资源
        * 
        * @param {请求参数} options 
        */
        Vue.prototype.$request=function(options){

        }

        Vue.prototype.$Assist = new Assist()
                
        Vue.component(Table.name, Table)
        
        Vue.component(Search.name, Search)

        Vue.component(Tab.name, Tab)

        Vue.component(Login.name, Login)
		
		Vue.component(Diglod.name, Diglod)
		
        Vue.component(Layout.name, Layout)
        
        
        Vue.component(Export.name, Export)

        Vue.component(Box.name, Box)
        Vue.component(BoxItem.name, BoxItem)
        
        Vue.component(Textarea.name,Textarea)

        Vue.component(Cascade.name,Cascade)
        
		Vue.component(EditButton.name,EditButton)
        Vue.component(SelectButton.name,SelectButton)
        Vue.component(AddButton.name,AddButton)
        Vue.component(ConfirmButton.name,ConfirmButton)
        

        /**
         * 请求拦截
         * @param {*} response 
         * @param {*} callback 
         */
        Vue.prototype.$handleResponse=function(response,callback){
            let {data} = response
            let {body,retMsg,retCode} = data
            if(retCode  !== '0000'){
                // this.$notify.error({
                //     title: '错误',
                //     message: retMsg+'&amp;'+body
                // })
                this.$message.error(retMsg)
            }else{
                if(typeof callback === 'function'){
                    callback(body);
                }
            }
        }

        /**
         * 判断是否为空
         * 
         * @param {*} obj 
         */
        Vue.prototype.$isEmpty=function(obj){
            return (typeof obj === 'undefined' || obj === null || obj === '' || (Array.isArray(obj) && obj.length < 1));
        }
    }
}