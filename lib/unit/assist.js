import Support from './../support.js'
/**
 * 辅助类
 */
export default class Assist extends Support{
    
    constructor(){
        super()
        this._config={}
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

    formatnumber(value, num=2){
        if(isNaN(Number(value))){
            return value
        }
        let a, b, c, i;
        a = value.toString();
        b = a.indexOf(".");
        c = a.length;
        if (num == 0) {
            if (b != -1) {
                a = a.substring(0, b);
            }
        } else {//如果没有小数点
            if (b == -1) {
                a = a + ".";
                for (i = 1; i <= num; i++) {
                    a = a + "0";
                }
            } else {//有小数点，超出位数自动截取，否则补0
                a = a.substring(0, b + num + 1);
                for (i = c; i <= b + num; i++) {
                    a = a + "0";
                }
            }
        }
        return a;
    }
}