<template>
        <div class="ueb-table">
            <el-table
                v-bind="$attrs"
                v-on="$listeners"
                ref="uebTable"
                v-on:page-change="pageChange"
                :data="data"
                stripe
                border
                :cell-class-name="handleCellClass"
                :span-method="objectSpanMethod"
                @header-click="handleHeaderClick">
                <slot></slot>
               <!--如果没有传入列属性 则跟 el-table写法一致-->
               <template  v-for="tp in typesColumns">
                    <el-table-column v-if="tp.type === 'expand'" 
                    v-bind="getColBind(tp)"
                    type="expand"
                    align="center"
                    header-align="center"
                    :key="column.type">
                        <template slot-scope="props">
                            <slot name="expand" v-bind="props"></slot>
                        </template> 
                    </el-table-column>
                    <el-table-column v-else
                      :key="tp.type"
                      :type="tp.type"
                      :resizable="tp.resizable===true?true:false"
                      v-bind="getColBind(tp)">
                    </el-table-column>
               </template>
               <template v-for="col in renderColumns">
                    <el-table-column v-if="typeof col.slot === 'undefined' || col.slot === null || col.slot === ''"
                        :resizable="col.resizable===true?true:false"
                        :key="col.label"
                        v-bind="getColBind(col)"
                        align="left">
                        <template slot-scope="scope" inline-template>
                            <span v-if="typeof col.formatter === 'function'" 
                                 v-html="col.formatter(scope.row,scope.column,scope.row[scope.column.property],scope.$index)"></span>
                            <span v-else v-html="scope.row[scope.column.property]"></span>
                        </template>
                    </el-table-column>
                    <slot v-else :name="col.slot"></slot>
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
             width="30%"
              append-to-body>
              <el-transfer
                style="text-align: left; display: inline-block"
                :titles="['隐藏字段', '显示字段']"
                v-model="showColumn"
                @change="handleChange"
                :render-content="renderFunc"
                :props="{
                    key: 'id',
                    label: 'label'
                }"
                :data="tableColumn">
                    
                </el-transfer>

             <span slot="footer" class="dialog-footer">
                <el-button @click="cancel">取 消</el-button>
                <el-button type="primary" @click="save">确 定</el-button>
             </span>
            </el-dialog>

        </div>
    </template>
    <script >
       import ElTable from 'element-ui/lib/table'
       import ElTableColumn from 'element-ui/lib/table-column'
       
    
       const TYPES = ['selection', 'expand', 'index'];
       
       export default{
            name:'ueb-table',
            props:{
                ...ElTable.props,
                'data':{
                    required:false,
                    type:Array,
                    default:[]
                },
                'paging':{
                    required:false,
                    type:Boolean,
                    default:true
                },
                'pagination':{
                    required:false,
                    type:Object,
                    default:()=>{return { pageNum:1,pageSize:10}}
                },
                'sizeOption':{
                    required:false,
                    type:Array,
                    default:()=>[10,25,50,100]
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
                    page:this.pagination
                }
            },
            computed:{
                //用于渲染特例
                typesColumns () {
                    const {columns}=this;
                    const result=[];
                    for(let cloumn in columns){
                        let data=columns[cloumn];
                        if(typeof data.type === 'string' && ~TYPES.indexOf(data.type)){
                            data['visible']=true;
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
                        if(typeof data.type=== 'undefine' || (!~TYPES.indexOf(data.type) && data.type !== 'btn')){
                            if(typeof data.align === 'undefine'){
                                data['align']='left'
                            }
                            data['visible']=true;
                            data['operation']=true;
                            result.push(data);
                        }
                    }
                    return result;
                },
                btnColumns (){
                    const {columns}=this;
                    let that=this;
                    const result=[];
                    for(let cloumn in columns){
                        let data=columns[cloumn];
                        if(typeof data.type !== 'undefine' && data.type === 'btn'){
                            if(typeof data.align === 'undefine'){
                                data['align']='center'
                            }
                            data['visible']=true;
                            data['operation']=false;
                            result.push(data);
                        }
                    }                   
                    return result;
                }
            },
            created(){
                this.initialization(); 
            },
            mounted(){
                this.initializationColums();
            },    
            methods:{
                cancel(){
                    this.showColumn = this.intitColumn;
                    this.dialogVisible = false;
                },
                save(){
                    var that = this;
                    //隐藏列
                    this.intitColumn = this.showColumn;
                    this.visibleColumn();
                   // console.log(this.$refs.uebTable.columns);
                    this.$refs.uebTable.doLayout(); 
                    this.dialogVisible = false;
                },
                handleCellClass({row, column, rowIndex, columnIndex}){
                    //console.log(row,column,rowIndex,columnIndex);
                },
                handleChange(obj){
                    this.showColumn = obj;
                },
                getColBind (col) {
                    const bind = Object.assign({}, col)
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
                    var columns = this.$refs.uebTable.columns;
                    columns.forEach((element,index) => {
                        var {id,type,property,label}=element;
                        if(type === 'default' && typeof property !== 'undefined'&&typeof label !== 'undefined'){
                            if(that.tableColumn.indexOf(element)!==-1){
                                //还未隐藏 判断该列是否需要隐藏 如果需要隐藏 则删除掉该元素 
                                if(that.showColumn.indexOf(id) === -1){                                   
                                    // that.$refs.uebTable.columns.splice(index,1);       
                                   element.visible = false;                        
                                }    
                            }else{
                                //已经隐藏 判断该列是否需要显示
                                if(that.showColumn.indexOf(id) !== -1){
                                    //根据property 获取列属性
                                    var obj=getColumn(id);   
                                    if(obj !== null){
                                        element.visible = true;        
                                    //    that.$refs.uebTable.columns.splice(index,0,obj);
                                    }
                                }
                            }
                        }
                    });
                },
                initializationColums(){
                    //初始化的时候把列属性 copy一份到tableColumn 属性上面   初始化需要显示的列 showColumn
                   var that = this;
                   this.$refs.uebTable.columns.forEach(element => {
                        var {id,type,property,label}=element;
                        if(type === 'default' && typeof property !== 'undefined'&&typeof label !== 'undefined'){
                            that.tableColumn.push(element);
                            that.showColumn.push(id);
                            that.intitColumn.push(id);
                        }
                   });
                   //TODO 从后台获取需要显示/隐藏的列
                   
                   this.visibleColumn();            
                },
                initialization(){
                   
                }
            }
        }
    </script>
    <style>
        .row-btn{
            color: blue;
            cursor:pointer;
        }
        .new{
            color: red;
            border: 1px solid red;
            background-color: rgba(253, 252, 252, 0.1);
        }
        .ueb-table{
            margin-left: 20px;
        }
    </style>