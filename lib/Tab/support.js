import Support from './../support.js'
//私有方法 init
const init = Symbol('init')
//符号
const getSymbol = Symbol('getSymbol')

const allFields = Symbol('allFields')

/**
 * 处理Tab页的数据 
 */
export default class DataSupport extends Support{
    
    constructor(fields=[],data=[],defaultName){
        super()
        this.fields = []
        this.defaultName = defaultName
        this.formData=[]  
        this[init](fields)  
        if(data.length<1){
            this.data = this.saveTab(data,{name:this.defaultName,df:true})
        }
    }
    /**
     * 初始化
     */
    [init](fields){
        this.symbols= [{id:'eq',name:'等于'},{id:'ne',name:'不等于'},{id:'lt',name:'小于'},{id:'le',name:'小于等于'},
            {id:'gt',name:'大于'},{id:'ge',name:'大于等于'},{id:'in',name:'in'},{id:'lk',name:'包含'},{id:'nk',name:'不包含'},
            {id:'sw',name:'开头是'},{id:'ew',name:'结尾是'},{id:'BETWEEN',name:'介于'}]
        this.groups = { text:['eq','ne','lk','nk','sw','ew'],date:['eq','ne','gt','ge','lt','le','BETWEEN'],number:['eq','ne','gt','ge','lt','le'],selected:['eq']}
        this.pickerOptions={shortcuts: [{ text: '最近一周',onClick(picker) {const end = new Date();const start = new Date();start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);picker.$emit('pick', [start, end]);}}, {text: '最近一个月', onClick(picker) {const end = new Date();const start = new Date();start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);picker.$emit('pick', [start, end]);}}, {text: '最近三个月',onClick(picker) {const end = new Date();const start = new Date();start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);picker.$emit('pick', [start, end])}}]}
        this[allFields] = []
        this.tabs=[]
        if(Array.isArray(fields)){
            fields.forEach(item=>{
                let {id,name} = item
                this[allFields].push({id:id,name:name,disabled:false})
            })
            fields.forEach(item=>{
                let {id,options,symbols,search} = item
                let copyFields = Object.assign({type:'text',fields:this[allFields],condition:'',field:id,value:'',tags:true,filtrate:true},item)
                if(typeof options != 'undefined'){
                    let arr=[]
                    if(Array.isArray(options)){
                        arr = options
                    }else if(super._isFunction(options)){
                        arr = options()
                    }
                    if(Array.isArray(arr)){
                        copyFields.type = 'selected'
                        copyFields.options = arr
                        //设置默认值
                        for(let k in arr){
                            if(arr[k].df === true){
                                copyFields.value = arr[k].value
                                break
                            }
                        }
                    }
                }
                //自定义符号
                if(!super._isEmpty(symbols)){
                    copyFields.symbols = this[getSymbol](symbols)
                }
                if(super._isEmpty(copyFields.symbols)){
                    copyFields.symbols = this[getSymbol](copyFields.type)
                }
                copyFields.condition = copyFields.symbols[0].id
                copyFields.search = search === true?true:false
                this.fields.push(copyFields)
            })
        }  
    }
    /**
     * 获取符号
     */
    [getSymbol](obj){
        let arr=[]
        let result = []
        if(Array.isArray(obj)){
            arr=[...obj]
        }else if(this._isString(obj)){
            arr = this.groups[obj]
        }
        if(arr.length<0){
            arr = this.groups['text']
        }
        this.symbols.forEach(item=>{
            let {id} = item
            for(let i in arr){
                let o = arr[i]
                if(this._isString(o) && id === o){
                    result.push(item)
                    break
                }
                if(this._isJson(o) && o.id === id){
                    result.push(item)
                    break
                }
            }    
        })
        return result
    }
    /**
     * 保存Tab页
     * @param {*} obj 
     */
    saveTab(arr=[],obj){
        arr.push(obj)
        //给Tab分配ID
        arr.forEach((item,index)=>{
            let {id,searchs,model} = item
            if(super._isEmpty(id)){
                item.id = '_scheme'+index
            }
            if(super._isEmpty(searchs)){
                item.searchs=this.getFields(null)                
            }
            if(super._isEmpty(model)){
                item.model={}
                item.searchs.forEach(ite=>{
                    
                })
            }
        })
        return arr
    }
    /**
     * 获取需要查询的列 默认3列
     * @param {*} obj 
     */
    getFields(obj){
        let result=[]
        if(super._isEmpty(obj)){
            for(let i in this.fields){
                if(i==3){
                    break;
                }
                result.push(this.fields[i]) 
            }
        }
        return result
    }
    /**
     * 打开Tab页
     * @param {*} id 
     */
    openTab(id){

    }
    /**
     * 关闭tab页
     * @param {*} id 
     */
    closeTab(id){

    }
    /**
     * 添加条件
     */
    addCondition(data=[]){
       if(data.length >= this.fields.length){
           throw '最多可以设置'+this.fields.length+'个条件!'
       }
       //指定添加ID
        for(let i in this.fields){
            let obj = this.fields[i]
            let {id,selected} = obj
            if(selected === true){
                continue
            }
            data.push(Object.assign({},obj))
            break
        }
        this.disableCloumn(data)
        return data
    }

    disableCloumn(obj){
        this.fields.forEach(ite=>{
            let {id} = ite
            ite.selected = false
            for(let i in obj){
                if(obj[i].id === id){
                    ite.selected = true
                    break
                }
            }
        })   
        if(Array.isArray(obj)&&obj.length>0){
            let selected=[]
            obj.forEach(item=>{
                selected.push(item.field)
            })
            obj.forEach((item)=>{
                let{field,fields} = item    
                fields.forEach(ite=>{
                    let {id} = ite;
                    ite.disabled=false
                    if(id !== field && selected.indexOf(id)!==-1){
                        ite.disabled = true
                    }
                })
            })
        } 
         
    }
    /**
     * 删除条件
     * @param {*} obj 
     */
    removeCondition(arr,obj){
        //清除
        let flag = false
        if(!this._isEmpty(obj)){
            for(let i in arr){
                if(this._isString(obj)){
                    if(obj === arr[i].id){
                        arr.splice(i,1)
                        flag=true
                        break;
                    }
                }else{
                    if(obj.id === arr[i].id){
                        arr.splice(i,1)
                        flag=true
                        break;
                    }
                }
            }
        }
        if(!flag){
            arr=[]
        }
        this.disableCloumn(arr)
        return arr
    }

    /**
     * 字段变更
     */
    fieldChange(obj){
        let result=[]
        if(!super._isEmpty(obj)){
            obj.forEach((item)=>{
                let{field,value,type,id} = item
                if(id !== field){
                    for(let i in this.fields){
                        let {id,type:type1} = this.fields[i]
                        if(id === field){
                            let o = Object.assign({},this.fields[i])
                            o.field = field
                            if(type1 === type && type1 !== 'selected' && type1 !== 'date'){
                                o.value = value
                            }
                            result.push(o)
                            break;
                        }
                    }
                }else{
                    result.push(item)
                }  
            })
        }
        this.disableCloumn(result)
        return result
    }
} 