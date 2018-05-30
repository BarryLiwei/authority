<template>
        <div class="ueb-table">
            <el-table
                v-bind="$attrs"
                v-on="$listeners"
                v-on:page-change="pageChange"
                :data="data"
                stripe
                border
                :span-method="objectSpanMethod"
                @header-click="handleHeaderClick"
               >
               <!--如果没有传入列属性 则跟 el-table写法一致-->
               <template v-if="isCloumnSlot">
                   <slot ></slot>
               </template>
               <template v-else v-for="tp in typesColumns">
                    <el-table-column v-if="tp.type === 'expand'" 
                    v-bind="getColBind(tp)"
                    type="expand"
                    align="center"
                    header-align="center"
                    :key="column.type"
                    >
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
               <el-table-column v-for="col in renderColumns" 
                    :resizable="col.resizable===true?true:false"
                    :key="col.label"
                    v-bind="getColBind(col)"
                    align="left"
                    >
                    <template slot-scope="scope" inline-template>
                       <span v-if="typeof col.formatter === 'function'" 
                       v-html="col.formatter(scope.row,scope.column,scope.row[scope.column.property],scope.$index)">
                       </span>
                        <span v-else v-html="scope.row[scope.column.property]">
                        </span>
                    </template>
                </el-table-column>
                
                <slot name="btn"></slot>
                <!--隐藏/显示列按钮-->
                <el-table-column 
                    v-if="rowBtn"
                    v-bind="rowBtnCloumns"
                >
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
                    :total="pageTotal"
                    align="left"
                >
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
                v-model="value4"
                :left-default-checked="[2, 3]"
                :right-default-checked="[1]"
                :titles="['隐藏字段', '显示字段']"
                :format="{
                    noChecked: '${total}',
                    hasChecked: '${checked}/${total}'
                }"
                @change="handleChange"
                :data="generateData">
                <span slot-scope="{ option }">{{ option.key }} - {{ option.label }}</span>
                </el-transfer>

             <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
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
                this.init();

            },
            data() {
                const generateData = _ => {
                    const data = [];
                    for (let i = 1; i <= 15; i++) {
                    data.push({
                        key: i,
                        label: `备选项 ${ i }`,
                        disabled: i % 4 === 0
                    });
                    }
                    return data;
                };
                return {
                    pageTotal:0,
                    page:{
                        pageNum:1,
                        pageSize:10
                    },
                    pageSizeOption:[10,25,50,100],
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
                    tableColumn:[],
                    generateData: generateData(),
                    value3: [1],
                    value4: [1],
                    renderFunc(h, option) {
                    return <span>{ option.key } - { option.label }</span>;
                    }
                }
            },
            watch:{
                page:{
                    deep: true,
                    handler(newValue, oldValue){
                        this.pageChange(newValue.pageNum,newValue.pageSize);
                    }
                }
            },
            methods:{
                handleChange(){

                },
                handleClose(){
                    this.dialogVisible=false;
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
                handleCurrentChange:function(val){
                    this.page.pageNum = val;
                },
                handleSizeChange:function(val){
                    this.page.pageSize = val;
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
                objectSpanMethod:function({ row, column, rowIndex, columnIndex }){
                    let {labelClassName,label} = column;
                    if(this.isAdd(this.tableColumn,column)){
                        //初始化列数据
                        this.tableColumn.push(column);
                    }
                    if('row-btn' === labelClassName && '...' === label){
                       this.index = columnIndex -1;
                       return [0,0]
                    }
                    if(this.index!=null && this.index === columnIndex){
                        return [1,2]
                    }
                },
                handleHeaderClick:function(column, event){
                    let {labelClassName,label} = column;
                    if('row-btn' === labelClassName && '...' === label){
                     //选择隐藏/显示列 
                     this.dialogVisible=true; 
                     console.log(this.tableColumn);
                    }
                },
                init:function(){
                   let {pageNum,pageSize} = this.pagination;
                   let sizeOption = this.sizeOption;
                   let total = this.total;
                   //赋值 
                   if(pageNum!== null && typeof pageNum !== 'undefined'&&pageNum>0){
                       this.page.pageNum = pageNum;
                   }
                   if(pageSize!== null && typeof pageSize !== 'undefined'&&pageSize>0){
                       this.page.pageSize = pageSize;
                   }
                   this.pageTotal = total;
                   this.pageSizeOption = sizeOption;
                   if(this.columns.length>0){
                       this.isCloumnSlot=false;
                   }
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