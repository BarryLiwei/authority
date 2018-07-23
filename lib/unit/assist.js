import Support from './../support.js'
/**
 * 辅助类
 */
export default class Assist extends Support{
    
    constructor(){
        super()
        this._config={}
        this.validate = new validate()
    }

    get config(){
        return this._config
    }

    set config(obj){
       this._config = Object.assign({},obj||{})
    }
    /**
     * 查询 批量查询
     * @param {请求类型} type 
     * @param {请求参数} obj 
     */
    search(type,obj){

    }
    /**
     * 替换方法
     * @param {*} obj  原JSON对象
     * @param {*} config 配置JSON对象
     * @param {*} isDelete 是否删除原JSON对象中的值
     */
    convert(obj,config,isDelete = true){
        if(super._isJson(obj)&&super._isJson(config)){
            let result = Object.assign({},obj)
            for(let i in result){
                let key = null
                let ct = null
                let separator  = null
                for(let k in config){
                    if(k == i){
                        let co = config[k]
                        if(super._isJson(co)){
                            let {key:k12,type,separator:s1}=co
                            ct = type
                            key = k12
                            separator = s1
                        }else{
                            key = co
                        }
                        break
                    }
                }
                if(!super._isEmpty(key) && key != i){
                   separator = separator||''
                   let value = result[i]
                   let ide = isDelete
                   //如果是数组 则默认是时间类型
                   if(Array.isArray(key)){
                       let va = []
                        if(Array.isArray(value)){
                            va = value
                        }else{
                            try{
                                va = value.split(separator)
                            }catch(e){}
                        }
                        key.forEach((item,index)=>{
                            if(item == i){
                                ide = false
                            }
                            result[item] = ''
                            if(va.length>index){
                                result[item] = va[index]
                            }
                        })
                   }else{
                     result[key] = value
                   }
                   if(isDelete === true){
                      delete result[i]
                    }
                }
            }
            return  result
        }
        return obj
    }



}
/**
 * 常用校验方法
 */
class validate{
    constructor(){

    }
    /**
     * 金额
     * @param {*} rule 
     * @param {*} value 
     * @param {*} callback 
     */
    money(rule, value, callback){
        var regu = /(^[1-9]([0-9]+)?(\.[0-9]{1,2})?$)|(^(0){1}$)|(^[0-9]\.[0-9]([0-9])?$)/
        if (!value) {
            return callback(new Error('金额不能为空'));
        }
        if (!regu.test(value)) {
            return callback(new Error('金额的输入格式不正确'));
        }
        return callback()
    }
    /**
     * 邮箱
     * @param {*} rule 
     * @param {*} value 
     * @param {*} callback 
     */
    email(rule, value, callback){
        var regu = /^[a-zA-Z0-9_.-]+@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*\.[a-zA-Z0-9]{2,6}$/
        if (!value) {
            return callback(new Error('请输入邮箱'));
        }
        if (!regu.test(value)) {
            return callback(new Error('邮箱的输入格式不正确'));
        }
        return callback()
    }


}