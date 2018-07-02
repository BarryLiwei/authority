<template>
    <el-row>
        <el-form-item v-for="(condition,index) in conditions">
            <el-col :span="5">
                <el-select placeholder="请选择" v-model="condition.field" @change="handleFieldChange">
                    <el-option
                        v-for="(field,index1) in obj.fields"
                        :key="'field'+index"
                        :label="field.label"
                        value-key="value"
                        :disabled="field.disabled"
                        :value="field.value">
                    </el-option>
                </el-select>
            </el-col>
            <el-col :span="5">
                <el-select placeholder="请选择"  v-model="condition.condition" @change="handleSymbolChange">
                    <el-option
                        v-for="(sym,index2) in condition.symbols"
                        :key="'symbols'+index2"
                        :label="sym.name"
                        value-key="id"
                        :value="sym.id">
                    </el-option>
                </el-select>
            </el-col>
            <el-col :span="12">
                <el-input v-model="condition.value" :key="'text'+index" placeholder="输入值" v-if="condition.type === 'text' || condition.type === 'number'"></el-input>
                <el-select placeholder="请选择"  v-model="condition.value" :filterable="condition.search" v-else-if="condition.type === 'selected'">
                    <el-option
                        v-for="(o,index3) in condition.options"
                        :key="'selected'+index3"
                        :label="o.label"
                        value-key="value"
                        :value="o.value">
                    </el-option>
                </el-select>

                <el-date-picker
                    v-else-if="condition.type === 'date' && condition.condition!=='BETWEEN'"
                    :key="'date'+index"
                    v-model="condition.value"
                    type="date"
                    placeholder="选择日期"
                    :format="condition.format">
                </el-date-picker>
                <el-date-picker
                    v-else-if="condition.type === 'date' && condition.condition === 'BETWEEN'"
                    :key="'daterange'+index"
                    v-model="condition.value"
                    type="daterange"
                    placeholder="选择日期"
                    :picker-options="pickerOptions"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                    :format="condition.format">
                </el-date-picker>
            </el-col>
        </el-form-item>
    </el-row>
</template>
<script>
    //是否是字符串
    const isString=(obj)=>{return Object.prototype.toString.call(obj) === "[object String]"}
    //是否是JSON
    const isJson=(obj)=>{return typeof(obj) == "object" && Object.prototype.toString.call(obj).toLowerCase() == "[object object]" && !obj.length}
    //是否为空
    const isEmpty=(obj)=>{return (typeof obj === 'undefined' || obj === null || obj === '' || (Array.isArray(obj) && obj.length < 1))}
    //获取所有的关系运算符
    const getSymbols = () => { 
        return [{id:'eq',name:'等于'},{id:'ne',name:'不等于'},{id:'lt',name:'小于'},{id:'le',name:'小于等于'},
                {id:'gt',name:'大于'},{id:'ge',name:'大于等于'},{id:'in',name:'in'},{id:'lk',name:'包含'},{id:'nk',name:'不包含'},
                {id:'sw',name:'开头是'},{id:'ew',name:'结尾是'},{id:'BETWEEN',name:'介于'}];
    }
    //获取分组信息
    const grouping = { text:['eq','ne','lk','nk','sw','ew'],date:['eq','ne','gt','ge','lt','le','BETWEEN'],number:['eq','ne','gt','ge','lt','le'],selected:['eq']}             
    //获取关系
    const getSymbol = (obj) =>{
        var arr=[],result=[];
        if(isString(obj)){
            arr.push(obj);
        }else if(Array.isArray(obj)){
            arr = arr.concat(obj);
        }
        if(arr.length>0){
            let symbols = getSymbols();
            symbols.forEach(item=>{
                let {id} = item;
                if(arr.indexOf(id)!==-1){
                    result.push(item); 
                }
            })
        }
        return result;
    }
    //字段类型限制为以下几种
    const types=['text','date','selected','number'];

    const getFields=(val)=>{
        if(!Array.isArray(val)){
            return null;
        }
        var result  = [];
        val.forEach(item=>{
            let {id,name} = item;
            result.push({id:id,name:name,disabled:false});
        });
        return result;
    }
    //转换为fields
    const transitionFields = (val) =>{
        if(!Array.isArray(val)){
            return null;
        }
        var fs = getFields(val);
        var fields = [];
        val.forEach(item=>{
            let field = Object.assign({},item);
            let {id,name,df,options,type}=item;
            field.type = isEmpty(type)?types[0]:type;
            if(Array.isArray(options) || typeof options === 'function'){
                field.type = 'selected';
                 //如果options 为方法体
                if(typeof options === 'function'){
                    field.options = options() || [];
                }
            }
            if(types.indexOf(field.type) === -1){
                field.type = types[0];
            }
            if(field.type === 'date'){
                field.format = field.format || 'yyyy-MM-dd';
            }
            let conditions = grouping[field.type];
            if(!Array.isArray(conditions) || conditions.length<1){
                console.warn('未找到关系运算符,忽略该数据!');
            }else{
                field.symbols =  getSymbol(conditions);
                field.fields = fs;
                field.field = id;
                field.condition = conditions[0];
                field.value ='';
                fields.push(field);
            }
        })
        return fields;
    }

    export default{
        name:'customForm',
        props:{
            fields:{
                type:Array,
                default:()=>[]
            },
            isAdd:{
                type:Boolean,
                default:()=>false
            }      
        },
        data(){
            let pickerOptions=()=>{
                return {shortcuts: [{ text: '最近一周',onClick(picker) {const end = new Date();const start = new Date();start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);picker.$emit('pick', [start, end]);}}, {text: '最近一个月', onClick(picker) {const end = new Date();const start = new Date();start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);picker.$emit('pick', [start, end]);}}, {text: '最近三个月',onClick(picker) {const end = new Date();const start = new Date();start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);picker.$emit('pick', [start, end]);}}]}
            }
            return {
                packFields:[],
                conditions:[],
                pickerOptions:pickerOptions() 
            }
        },
        created(){
            this.packFields = transitionFields(this.fields);
           
        },
        methods:{
            //初始化 回调函数
            init(data){

            },
            //添加条件
           addCondition(val){
               if(this.conditions.length >= this.packFields.length){
                    this.$notify({
                        title: '提示',
                        message:'最多可以设置'+this.packFields.length+'个条件!'
                    }); 
                    return ;
               }
               for(let i in this.packFields){
                   let item = this.packFields[i];
                   let {_isChoose,field} =  item;
                   if(!isEmpty(val)){
                    if(_isChoose !== true && field === val){
                        this.conditions.push(item);
                        item._isChoose = true;
                        break; 
                    }
                   }
                   if(_isChoose !== true){
                     this.conditions.push(item);
                     item._isChoose = true;
                     break;
                   }
               }
               //获取全部已经选择的选项
               var allSelectedFields=[];
               this.conditions.forEach(item=>{
                    let {field} = item;
                    if(typeof field !== 'undefined' && field !== null && field !== ''){
                        allSelectedFields.push(field);     
                    }                 
                })
               //禁用已经选择的选项
               this.conditions.forEach(item=>{
                   let {field,fields} = item;
                   fields.forEach(f=>{
                        f.disabled=false;
                        if(f.value !== field && allSelectedFields.indexOf(f.value)!==-1){
                            f.disabled=true;
                        }
                    })
               })   
           },
           //删除条件
           removeCondition(item){
                var index = this.conditions.indexOf(item);
                if (index !== -1) {
                    var condition = this.conditions[index];
                    let {id1:id} = condition;
                    for(let i in this.packFields){
                        let item = this.packFields[i];
                        let {id} =  item;
                        if(id1 === id){
                            item._isChoose = false;
                            break;
                        }
                    }
                    this.conditions.splice(index, 1)
                }
           },
           handleFieldChange(val){

           }
        }
    }
</script>