<template>
        <div class="ueb-table">
            <!-- 列表 -->
            <el-table
                ref="uebTable"
                v-on:page-change="pageChange"
                stripe
                border
                :max-height="maxHeight"
                :cell-class-name="handleCellClass"
                :span-method="objectSpanMethod"
                @header-click="handleHeaderClick"
                :data="tableData"
                v-bind="$attrs"
                v-on="$listeners">
                <slot></slot>
               <!--如果没有传入列属性 则跟 el-table写法一致-->
               <template  v-for="tp in tc">
                    <el-table-column v-if="tp.type === 'expand'"
                        type="expand"
                        align="center"
                        show-overflow-tooltip
                        header-align="center"
                        v-bind="getColBind(tp)"
                        :key="column.type">
                        <template slot-scope="props">
                            <slot name="expand" v-bind="props"></slot>
                        </template> 
                    </el-table-column>
                    <el-table-column v-else
                      :key="tp.type"
                      :type="tp.type"
                      show-overflow-tooltip
                      :resizable="tp.resizable===true?true:false"
                      v-bind="getColBind(tp)">
                    </el-table-column>
               </template>
               <el-table-column type="index" label="序号" width="56" v-if="isIndex">

               </el-table-column>
               <template v-for="(col,index) in rc">
                    <el-table-column v-if="col.visable === true && (typeof col.slot === 'undefined' || col.slot === null || col.slot === '')"
                        :resizable="col.resizable===true?true:false"
                        :key="col.label"
                        show-overflow-tooltip
                        v-bind="getColBind(col)"
                        align="left">
                        <template slot-scope="scope" inline-template>
                            <span v-if="typeof col.formatter === 'function'" 
                                 v-html="col.formatter(scope.row,scope.column,scope.row[scope.column.property],scope.$index)"></span>
                            <span v-else-if="typeof col.edit !== 'undefined'">
                               <span v-if="getEdit(scope.row,scope.column.property,scope.row[scope.column.property],scope.$index,col) !== true" 
                                    v-html="getCellValue(scope.row[scope.column.property],scope.column,col)">
                                </span>
                                <el-form :ref="'tableFormRef_'+scope.$index+'_'+scope.column.property" :model="values" v-else status-icon inline-message>
                                    <el-form-item 
                                        style="margin:none;"
                                        :prop="'model.'+scope.$index+'.'+scope.column.property" 
                                        :rules="Array.isArray(col.rules)?col.rules:[]">
                                        <!-- 编辑 -->
                                        <ueb-redact :deploy="col" size="mini"
                                            v-if="typeof values.model[scope.$index]['__change_cell__'+scope.column.property] === 'function'"
                                            @change="handleChangeCell1(values.model,col,values.model[scope.$index],
                                                        values.model[scope.$index]['__change_cell__'+scope.column.property],
                                                        values.model[scope.$index][scope.column.property],'tableFormRef_'+scope.$index+'_'+scope.column.property,scope.$index)"
                                            :options="options"
                                            style="border: 0px;outline:none;cursor: pointer;"
                                            v-model="values.model[scope.$index][scope.column.property]">
                                        </ueb-redact>

                                        <ueb-redact :deploy="col" size="mini"
                                            v-else
                                            @change="handleChangeCell(col,'tableFormRef_'+scope.$index+'_'+scope.column.property,scope.$index,scope.column.property)"
                                            :options="options"
                                            style="border: 0px;outline:none;cursor: pointer;"
                                            v-model="values.model[scope.$index][scope.column.property]">
                                        </ueb-redact>

                                    </el-form-item>
                                </el-form>
                            </span>   
                            <span v-else-if="typeof col.calculate === 'function'" >
                                <el-form  :ref="'tableFormRef_'+scope.$index+'_'+scope.column.property" :model="values" status-icon inline-message>
                                    <el-form-item 
                                        style="margin:none;"
                                        :prop="'model.'+scope.$index+'.'+scope.column.property" 
                                        :rules="Array.isArray(col.rules)?col.rules:[]" 
                                        v-html="getCellValue(values.model[scope.$index]['_calculate__'+scope.column.property],scope.column,col)">
                                    </el-form-item>
                                </el-form>
                            </span> 
                            <span v-else v-html="getCellValue(scope.row[scope.column.property],scope.column,col)"></span>
                        </template>
                    </el-table-column>
                    <slot v-else-if="col.visable === true && (typeof col.slot !== 'undefined' || col.slot !== null || col.slot !== '')" 
                        :name="col.slot" v-show="col.visable === true"></slot>
               </template>
                <slot name="btn"></slot>
                <!--隐藏/显示列按钮-->
                <el-table-column 
                    v-if="rowBtn" 
                    v-bind="rowBtnCloumns">
                </el-table-column>
            </el-table>
            <div class="table-page" v-if="paging">
                <el-pagination
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                    :current-page="page.pageNum"
                    :page-sizes="pageSizeOption"
                    :page-size="page.pageSize"
                    layout="total, sizes, prev, pager, next, jumper"
                    :total="total"
                    align="left">
                </el-pagination>
            </div>
            <!-- 选择列弹出窗 -->
            <el-dialog
              title="编辑字段"
              :visible.sync="dialogVisible"
              width="600px"
              :close-on-click-modal="false"
              append-to-body>
              <div class="tab_transfer">
                   <el-transfer
                        style="text-align: left; display: inline-block"
                        :titles="['隐藏字段', '显示字段']"
                        v-model="showColumn"
                        @change="handleChange"
                        :render-content="renderFunc"
                        :props="{ key: 'prop',label: 'label'}"
                        :data="tableColumn">                    
                    </el-transfer>
              </div>
             
             <span slot="footer" class="dialog-footer">
                <el-button @click="cancel">取 消</el-button>
                <ueb-btn-confirm  @click='save'></ueb-btn-confirm>
             </span>
            </el-dialog>

        </div>
    </template>
    <script >
       import ElTable from 'element-ui/lib/table'
       import ElTableColumn from 'element-ui/lib/table-column'
       import uebRedact from './input'
       const TYPES = ['selection', 'expand', 'index'];
       
       export default{
            name:'ueb-table',
            components:{uebRedact},
            props:{
                'data':{
                    type:Array,
                    default:()=>[]
                },
                'paging':{
                    required:false,
                    type:Boolean,
                    default:true
                },
                'pagination':{
                    required:false,
                    type:Object,
                    default:()=>{return { pageNum:1,pageSize:20}}
                },
                'sizeOption':{
                    required:false,
                    type:Array,
                    default:()=>[20,50,100,200]
                },
                'total':{
                    required:false,
                    type:Number,
                    default:()=>0
                },
                'search':{ 
                    
                    required:false,
                    type:Object,
                    default:()=>{}
                },
                'columns':{
                    type: Array,
                    default:()=>[]
                },
                'pageChange':{
                    type:Function,
                    default:(pageNum,pageSize)=>{}
                },
                'rowBtn':{
                    type:Boolean,
                    default:true
                },
                'options':{
                    type:Object,
                    default:()=>{return {}}
                },
                maxHeight:{
                    type:[Number,String],
                    default:"540px"
                },
                sequence:{
                    type:Boolean,
                    default:true
                }
            },
            data() {
                return {
                    pageSizeOption:this.sizeOption,
                    isCloumnSlot:true,
                    rowBtnCloumns: {
                        'label':'...',//选择列是否隐藏
                        'header-align':'center',
                        'width':'50',
                        'resizable':false,
                        'label-class-name':'row-btn',
                    },
                    index:null,
                    dialogVisible:false,
                    //列属性
                    tableColumn:[],
                    showColumn:[],
                    intitColumn:[],
                    renderFunc:function(h, option){
                        return <span>{ option.label }</span>;
                    },
                    page:this.pagination,
                    tc:[],
                    rc:[],
                    tableData:[],
                    values:{
                        model:[]
                    },
                    isIndex:false
                }
            },
            computed:{ 
                btnColumns (){
                    const {columns}=this;
                    let that=this;
                    const result=[];
                    for(let cloumn in columns){
                        let data=columns[cloumn];
                        if(typeof data.type !== 'undefined' && data.type === 'btn'){
                            if(typeof data.align === 'undefined'){
                                data['align']='center'
                            }
                            data['visible']=true;
                            data['operation']=false;
                            result.push(data);
                        }
                    }                   
                    return result
                }
            },
            created(){
                this.tc = this.typesColumns()
                this.rc=this.renderColumns()                
                this.initialization()
            },
            mounted(){
                this.initializationColums()  
                // console.log('localStorage',localStorage.getItem("showColumn"));                                 
                // this.showColumn =localStorage.getItem("showColumn").split(",") ;
                // console.log('showColumnssss',this.showColumn);  
               //设置默认值
               this.tableData = this.data
               this.initModel()
            },
            watch:{
                data:{
                    deep:true,
                    handler(val){
                        this.tableData = val
                        this.initModel()
                    }
                },
                'values.model':{
                    deep:true,
                    handler(val){
                        
                    }
                }
            },    
            methods:{
                getCalculate(func,node,row){
                    return func(node,row)
                },
                initModel(){
                    let arr = []
                    if(Array.isArray(this.tableData)){
                        this.tableData.forEach((item,index)=>{
                            for(let i in item){
                                this.columns.forEach(ite=>{
                                    let {prop,calculate,changeRow}=ite
                                    if(typeof calculate === 'function'){
                                        item[prop] = calculate
                                    }else if(typeof changeRow === 'function'){
                                        item['__change_cell__'+prop] = changeRow
                                    }
                                })
                            }
                            arr.push(item)
                        })
                    }
                   this.values.model = arr
                },
                getEdit(rows,prop,value,index,col){
                    let {edit} = col
                    let result = false
                    if(typeof edit === 'function'){
                        result = edit(rows,value,index)
                    }else {
                        result = edit
                    }
                    if(result === true){
                        if(this.tableData.length >= index){
                            if(typeof this.tableData[index][prop] === 'undefined'){
                                this.tableData[index][prop] = ''
                            }
                        }
                    }
                    return result
                },
                blurCell(rows,prop,index){
                    //失去焦点的时间
                },
                editCell(rows,prop,index){
                    if(this.values.length>=index){
                        if(this.values[index][prop]['__edited'] !==true){
                            this.values[index][prop]['__edited']=true
                        }       
                    }
                },
                clearSelection(){
                    this.$refs.uebTable.clearSelection()
                },
                _isEmpty(obj){
                    return (typeof obj === 'undefined' || obj === null || obj === '' || (Array.isArray(obj) && obj.length < 1))
                },
                getCellValue(value,node,cols){
                    if(typeof(this.options) === 'object' &&
                         Object.prototype.toString.call(this.options).toLowerCase() == '[object object]' && 
                         !this.options.length){
                         let {property} = node  
                         let {options,'value-key':vk,'key-value':kv} = cols
                         if(options !== false){
                            let arr = []
                            if(Object.prototype.toString.call(options) === '[object String]'){
                                arr = this.options[options]
                                if(!Array.isArray(arr)||arr.length<1){ 
                                    return value
                                }
                            }else{
                                arr = this.options[property] 
                                if(!Array.isArray(arr)||arr.length<1){
                                    return value
                                }
                            }
                            let key = vk||'value'
                            let kv = kv||'label'
                            let result = ''
                            arr.forEach(item=>{
                                let label = item[key]
                                let v = item[kv]
                                if(this._isEmpty(label)){
                                    return ;
                                }
                                if(this._isEmpty(v)){
                                    return ;
                                }
                                if(label == value){
                                    result = v
                                }
                            })
                            if(!this._isEmpty(result)){
                                return result
                            }
                         }
                    }
                    return value
                },
                //用于渲染特例
                typesColumns () {
                    const {columns}=this;
                    const result=[];
                    for(let cloumn in columns){
                        let data=columns[cloumn];
                        if(typeof data.type === 'string' && ~TYPES.indexOf(data.type)){
                            data['visable']=true;
                            data['operation']=false;
                            result.push(data);
                        }
                    }
                    return result;
                },
                renderColumns () {
                    const {columns}=this;
                    let that=this;
                    const result=[];
                    for(let cloumn in columns){
                        let data=columns[cloumn];
                        if(typeof data.type=== 'undefined' || (!~TYPES.indexOf(data.type) && data.type !== 'btn')){
                            if(typeof data.align === 'undefined'){
                                data['align']='left'
                            }
                            
                            if(typeof data.visable ==='undefined'){
                                 data['visable']=true;
                            }
                            if(typeof data.prop ==='undefined' && typeof data.slot !=='undefined'){
                                data['prop'] = data.slot
                            }
                            data['operation']=true;
                            result.push(data);
                        }
                    }
                    return result;
                },
                cancel(){
                    this.showColumn = this.intitColumn;
                    this.dialogVisible = false;
                },
                save(){
                    var that = this;
                    //隐藏列
                    this.intitColumn = this.showColumn;
                    this.visibleColumn();
                    this.$refs.uebTable.doLayout(); 
                    //TODO 持久化数据
                //    / localStorage.setItem("showColumn", this.showColumn);
                    this.dialogVisible = false;
                },
                handleCellClass({row, column, rowIndex, columnIndex}){
                },
                handleChange(obj){
                    this.showColumn = obj;
                },
                handleChangeCell1(data,obj,row,func,val,ref,index){
                    let $ref = this.$refs[ref]
                    if(Array.isArray($ref) ){
                        $ref = $ref[0]
                    }
                    if(typeof $ref !== 'undefined'){
                        $ref.validate((valid)=>{
                            if (!valid) {
                                return 
                            }
                            let index = data.indexOf(row)
                            if(index !== -1){
                                let newRow = func(row,val)
                                if(typeof(newRow) === 'object' && Object.prototype.toString.call(newRow).toLowerCase() == '[object object]' && !newRow.length){
                                    data.splice(index,1,newRow)
                                }
                            }  
                        })
                    }   
                     
                },
                handleChangeCell(obj,ref,index,field){
                    let $ref = this.$refs[ref]
                    if(Array.isArray($ref)){
                        $ref = $ref[0]
                    }
                    if(typeof $ref !== 'undefined'){
                        $ref.validate((valid)=>{
                            if (!valid) {
                                return 
                            }
                            let arr = []
                            if(Array.isArray(this.values.model)){
                                this.values.model.forEach(item=>{
                                    for(let i in item){
                                        if(typeof item[i] === 'function'){
                                            item['_calculate__'+i]=item[i](item)
                                        }
                                    }
                                    arr.push(item)
                                })
                                this.values.model = arr
                            }
                        })
                    }
                   
                },
                getColBind (col) {
                    const bind = Object.assign({'show-overflow-tooltip':true}, col)
                    if(typeof bind.edit !=='undefined'){
                        bind['show-overflow-tooltip']=false
                    }
                    delete bind.component
                    delete bind.listeners
                    delete bind.propsHandler
                    return bind
                },
                getCptBind ({ row, column }, col) {
                    const props = { row, col, column }
                    const handler = col.propsHandler
                    return handler && handler(props) || props
                },
                handleCurrentChange(val){
                    this.page.pageNum = val;
                    this.$emit('page-change',this.page);
                },
                handleSizeChange(val){
                    this.page.pageSize = val;
                    this.$emit('page-change',this.page);
                },
                isAdd(arr,obj){
                    if(Array.isArray(arr)){
                        var index = arr.length;
                        var {label}=obj;
                        if(typeof label === 'undefined' 
                        || label===null 
                        || label==='' 
                        || label === '...'){
                            return false;
                        }
                        while (index--) {
                            if (arr[index].label === label) { 
                                return false;
                            }
                        } 
                    }
                    return true;
                },
                objectSpanMethod({ row, column, rowIndex, columnIndex }){
                    let {labelClassName,label} = column;
                    if('row-btn' === labelClassName && '...' === label){
                       this.index = columnIndex -1;
                       return [0,0]
                    }
                    if(this.index!=null && this.index === columnIndex){
                        return [1,2]
                    }
                },
                handleHeaderClick(column, event){
                    let {labelClassName,label} = column;
                    var that=this;
                    if('row-btn' === labelClassName && '...' === label){
                     //选择隐藏/显示列 
                     this.dialogVisible=true;     
                    }
                },
                getColumn(val){
                    for(let i in this.tableColumn){
                        var item = this.tableColumn[i];
                        var {id,type,property,label}=item;
                        if(val === id){
                            return item;
                        }
                    }
                    return null;
                },
                visibleColumn(){
                    var that = this;
                    this.rc.forEach((element,index) => {
                        var {id,type,prop,slot,label,visable}=element;
                        element.visable = false
                        this.showColumn.forEach(item=>{
                            if(prop === item){
                                element.visable=true
                            }
                        })
                        // if(~TYPES.indexOf(type) && (typeof prop !== 'undefined' || typeof slot !=='undefined')){                            
                        //     // if(that.tableColumn.indexOf(element)!==-1){
                        //     //     //还未隐藏 判断该列是否需要隐藏 如果需要隐藏 则删除掉该元素 
                        //     //     if(that.showColumn.indexOf(id) === -1){                                   
                        //     //         // that.$refs.uebTable.columns.splice(index,1);       
                        //     //        element.visable = false;
                        //     //     }    
                        //     // }else{
                        //     //     //已经隐藏 判断该列是否需要显示
                        //     //     if(that.showColumn.indexOf(id) !== -1){
                        //     //         //根据property 获取列属性
                        //     //         var obj=getColumn(id);   
                        //     //         if(obj !== null){
                        //     //             element.visable = true;   
                        //     //             console.log(this.$slots.default)  
                        //     //         //    that.$refs.uebTable.columns.splice(index,0,obj);
                        //     //         }
                        //     //     }
                        //     // }
                        // }
                    });
                    // this.columns = columns;
                },
                initializationColums(){
                    //初始化的时候把列属性 copy一份到tableColumn 属性上面   初始化需要显示的列 showColumn
                   var that = this;
                   this.rc.forEach(element => {
                        var {id,type,prop,slot,label,visable}=element;                      
                        if(!~TYPES.indexOf(type) && 
                            (typeof property !== 'undefined' || typeof slot !== 'undefined'|| typeof prop !=='undefined')
                            &&typeof label !== 'undefined'){
                            that.tableColumn.push(element);

                            if(visable === true){
                                 that.showColumn.push(prop);
                            } 
                            that.intitColumn.push(prop);
                        }
                   });
                   //TODO 从后台获取需要显示/隐藏的列
                   let isIndex = this.sequence
                   if(isIndex){
                        let columns = this.$refs.uebTable.columns
                        for(let i in columns){
                            let column=columns[i]
                            let {type} = column
                            if(type === 'index'){
                                    isIndex = false
                                break
                            }
                        }
                    }
                   this.isIndex = isIndex
                },
                initialization(){
                   
                },
                getEditData(){
                    let data = [...this.tableData]
                    let model = this.values.model
                    let result = []
                    data.forEach((item,index)=>{
                        if(model.length>=index){
                            let obj = model[index]
                            result.push(Object.assign(item,obj)) 
                        }else{
                            result.push(item) 
                        }
                    })
                    return result
                },
                validate(callback){
                    let str = null
                    let refs = this.$refs
                    let flag = true
                    for(let o in refs){
                        let item = refs[o]
                        if(Array.isArray(item)){
                            for(let k in item){
                                let {validate,validateField,clearValidate} = item[k]
                                if(typeof validate === 'function' && typeof validateField === 'function' && typeof clearValidate==='function'){
                                    item[k].validate((valid)=>{
                                        str = valid
                                        if(!valid){
                                            flag = false
                                        }
                                    })
                                }
                                if(!flag){
                                    break
                                }
                            }
                        }else{
                            let {validate,validateField,clearValidate} = item
                            if(typeof validate === 'function' && typeof validateField === 'function' && typeof clearValidate==='function'){
                                item.validate((valid)=>{
                                    str = valid
                                    if(!valid){ 
                                        flag = false
                                    }
                                })
                            }
                        }
                        if(!flag){
                            break
                        }
                    }  
                    if(typeof callback === 'function'){
                        callback(str)
                    }             
                },
                validateField(field,callback){
                    let refs = this.$refs
                    if(Array.isArray(refs)){
                        refs.forEach(item=>{
                            let {validate,validateField,clearValidate} = item
                            if(typeof validate === 'function' && typeof validateField === 'function' && typeof clearValidate==='function'){
                                validateField(field,callback)
                            }
                        })
                    }
                },
                clearValidate(){
                    //清除校验
                    let refs = this.$refs
                    if(Array.isArray(refs)){
                        refs.forEach(item=>{
                            let {validate,validateField,clearValidate} = item
                            if(typeof validate === 'function' && typeof validateField === 'function' && typeof clearValidate==='function'){
                                clearValidate()
                            }
                        })
                    }
                },
                getRef(){
                    return this.$refs.uebTable
                }
            }
        }
    </script>
    <style lang="less" scoped>
         /deep/ .el-dialog__header {
            border-bottom: 1px solid #dcdfe6!important;
         }
         .el-dialog__header /deep/ .el-dialog__title{
             font-size: 17px
         }
        /deep/ .row-btn{
            color: blue;
            cursor:pointer;
        }
        .new{
            color: red;
            border: 1px solid red;
            background-color: rgba(253, 252, 252, 0.1);
        }
        .tab_transfer{
            text-align: center;
            /deep/ .el-transfer__buttons {
                /deep/.el-button {
                    min-width: 0;
                    margin-left: 0;
                }
            }
        }

        .ueb-table{
            margin-left: 20px;
            margin-right: 20px;

            /deep/ .el-pagination{
                margin-top: 30px;
            }

            /deep/ .el-form-item{
                margin-bottom:0px !important;
            }
        }    
    </style>