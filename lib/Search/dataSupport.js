import Support from './../support.js'
//私有方法 init
const init = Symbol('init')
//私有属性 btns
const btns = Symbol('btns')
//私有方法
const getBtns = Symbol('getBtns')


/**
 * 数据支持js
 */
export default class SearchData extends Support{ 
    /**
     * 
     * @param {字段} fields 
     * @param {vue ref 对象} ref 
     * @param {createHtml} h
     */
    constructor(fields,model,filtrateType){
        super()
        this.fields = [...fields]
        this.filtrateType = filtrateType
        this[btns]=[{id:'filtrate',name:'筛选',icon:'',type:'text',popover:'filtrate'},
            {id:'reset',name:'重置',icon:'',type:'',popover:''},
            {id:'search',name:'查询',icon:'',type:'primary',popover:''},
            {id:'batch',name:'批量查询',icon:'',type:'text',popover:''}]     
        this.model=model
        this[init]()    
    }
    
   
    [getBtns](arr){
        let result = []
        this[btns].forEach(item=>{
            let {id} = item
            for(let i in arr){
                let o = arr[i]
                if(this._isString(o) && o.toLowerCase() === id){
                    result.push(item)
                    break
                }
            }
        })
        return result
    }
    /**
     * 初始化
     */
    [init](){
        this.tags=[]
        this.filtrates=[]
        this.batchs=[]
        this.btns=['search','reset']    
        if(Array.isArray(this.fields)){
            this.fields.forEach(item=>{
                let {tags,filtrate,batch,dv,type,transition}=item
                if(tags === true){
                    this.tags.push(item)
                }
                if(super._isJson(this.model)&&!this.model.hasOwnProperty(item.id)){
                    this.model[item.id]=''
                } 
                if(!super._isEmpty(dv)){
                    this.model[item.id] = dv
                }
                if(filtrate === true){
                    this.filtrates.push(item)
                }
                if(batch === true){
                    this.batchs.push(item)
                }
            })
            if(this.filtrates.length>0){
                this.btns.push('filtrate')
            }else if(this.filtrateType === '2' ||  this.filtrateType === 2){
                this.btns.push('filtrate')
            }
            if(this.batchs.length>0){
                this.btns.push('batch')
            } 
            this.btns = this[getBtns](this.btns)
        }
    }

    
    /**
     * 生成按钮
     */
    builderBtns(){
        return  this[getBtns](this.btns)
    }
    
    clearModel(model,field){
        if(!super._isEmpty(model)){
            if(Array.isArray(model)){
                for(let i in model){
                    let obj = model[i]
                    if(super._isJson(obj)){
                        let {field:f,condition,fields,name,symbols,value,bind}=obj
                        if(field === f){
                            if(!super._isEmpty(bind) && model.hasOwnProperty(bind)){
                                model[bind]=''
                                continue
                            }
                            obj.value=''
                            break
                        }   
                    }   
                }
            }else{
                for(let i in model){
                    if(field === i){
                        let obj = model[i]
                        if(super._isJson(obj)){
                            let {bind,df,value}=obj
                            if(!super._isEmpty(bind) && model.hasOwnProperty(bind)){
                                obj.value = df||''
                                model[bind]=''
                                continue    
                            }
                        }
                        model[i] = ''
                        break
                    }
                }
            }
        }    
    }
    /**
     * 清除标签数组
     * @param {} obj 
     */
    clearTag(tags,obj,model){
        let result = []
        if(Array.isArray(tags) && this._isJson(obj)){
            if(tags.indexOf(obj)!==-1){
                this.clearModel(model,obj.id)
                tags.splice(tags.indexOf(obj), 1)
            }
            result = tags 
        }else {
            tags.forEach(item=>{
                this.clearModel(model,item.id)
            })
            Object.assign(model,this.model)
        } 
        return result
    }

    /**
     * 生成标签数组
     * @param {*} model 
     */
    builderTag(model,callback){
        let result=[]
        if(this.tags.length>0){
            let transform = {}
            if(Array.isArray(model)){  
                model.forEach(item=>{
                    let {id,condition,value,symbols,bind}=item
                    if(!this._isEmpty(value) && !this._isEmpty(id)){
                        let cname=condition
                        if(Array.isArray(symbols)){
                            for(let i in symbols){
                                let obj = symbols[i]
                                let{id:id1,name}=obj
                                if(id1 === condition){
                                    cname = name
                                    break
                                }
                            }
                        }
                        transform[id] = cname+'﹑'+value
                    }
                })  
            }else if(this._isJson(model)){
                let binds=[]
                for(let i in model){
                    let obj = model[i]
                    if(super._isJson(obj)){
                        let {bind} = obj
                        if(model.hasOwnProperty(bind)){
                            binds.push(bind)
                        }
                    }
                }
                for(let i in model){
                    let obj = model[i]
                    if(super._isJson(obj)){
                        let {bind} = obj
                        if(model.hasOwnProperty(bind)){
                            transform[obj]=model[bind]
                        }
                    }else if(binds.indexOf(i)===-1){
                        transform[i] = obj
                    }
                }
            } 
            this.tags.forEach(item=>{
                let {id,name}=item
                for(let i in transform){
                    if(i === id){
                        let value=transform[i]
                        if(!this._isEmpty(value)){
                            let str=''
                            if(Array.isArray(value)){
                                let arr=[] 
                                value.forEach(o=>{
                                    if(this._isFunction(callback)){
                                        arr.push(callback(id,o)||o)
                                    }else{
                                        arr.push(o)
                                    }
                                }) 
                                str = arr.join()
                            }else{
                                if(this._isFunction(callback)){
                                    str = callback(id,value)||value
                                }else{
                                    str = value
                                }
                            }
                            result.push({id:id,name:name,value:str})
                        }
                        break
                    }
                }
            })  
        }
        return result
    }
}