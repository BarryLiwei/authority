<template>
    <div class="ueb-table">
        <el-table
            :data="tableData"
           >
            <slot></slot>
        </el-table>
        <div class="table-page" v-if="paging">
            <el-pagination
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="pagination.pageNum"
                :page-sizes="sizeOption"
                :page-size="pagination.pageSize"
                layout="total, sizes, prev, pager, next, jumper"
                :total="total"
                align="left"
            >
            </el-pagination>
        </div>
    </div>
</template>
<script >
    export default{
        name:'ueb-table',
        props:{
            'paging':{
                required:false,
                type:Boolean,
                default:true
            },
            'search':{
                required:false,
                type:Object
            },
            'source': {
                required : true,
                type:[Array,Function,Object]
            },
            'select':{
                required : false,
                type:Function
            },
            'select-all':{
                required : false,
                type:Function
            },
            'selection-change':{
                required : false,
                type:Function
            },
            'cell-mouse-enter':{
                required : false,
                type:Function
            },
            'cell-mouse-leave':{
                required : false,
                type:Function
            },
            'cell-click':{
                required : false,
                type:Function
            },
            'cell-dblclick':{
                required : false,
                type:Function
            },
            'row-click':{
                required : false,
                type:Function
            },
            'row-contextmenu':{
                required : false,
                type:Function
            },
            'row-dblclick':{
                required : false,
                type:Function
            },
            'header-click':{
                required : false,
                type:Function
            },
            'header-contextmenu':{
                required : false,
                type:Function
            },
            'sort-change':{
                required : false,
                type:Function
            },
            'filter-change':{
                required : false,
                type:Function
            },
            'current-change':{
                required : false,
                type:Function
            },
            'header-dragend':{
                required : false,
                type:Function
            },
            'expand-change':{
                required : false,
                type:Function
            },
            'height':{
                required : false,
                type:[String,Number],
            },
            'max-height':{
                required : false,
                type:[String,Number],
                default:600
            },
            'stripe':{
                required : false,
                type:Boolean,
                default:true
            },
            'border':{
                required : false,
                type:Boolean,
                default:true
            },
            'size':{
                required : false,
                type:String,
            },
            'fit':{
                required : false,
                type:Boolean,
                default:true
            },
            'show-header':{
                required : false,
                type:Boolean,
                default:true
            },
            'highlight-current-row':{
                required : false,
                type:Boolean,
                default:false
            },
            'current-row-key':{
                required : false,
                type:[String,Number],  
            },
            'row-class-name':{
                required : false,
                type:[Function,String],
            },
            'row-style':{
                required : false,
                type:[Function,Object],
            },
            'cell-class-name':{
                required : false,
                type:[Function,String],
            },
            'cell-style':{
                required : false,
                type:[Function,Object],
            },
            'header-row-class-name':{
                required : false,
                type:[Function,String],
            },
            'header-row-style':{
                required : false,
                type:[Function,Object],
            },
            'header-cell-class-name':{
                required : false,
                type:[Function,String],
            },
            'heheader-cell-styleight':{
                required : false,
                type:[Function,Object],
            },
            'row-key':{
                required : false,
                type:[Function,String],
            },
            'empty-text':{
                required : false,
                type:String,
            },
            'default-expand-all':{
                required : false,
                type:Boolean,
                default:false
            },
            'expand-row-keys':{
                required : false,
                type:Array,
            },
            'default-sort':{
                required : false,
                type:Object,
            },
            'tooltip-effect':{
                required : false,
                type:String,
               
            },
            'show-summary':{
                required : false,
                type:Boolean,
                default:false
            },
            'sum-text':{
                required : false,
                type:String,
                default:'合计'
            },
            'summary-method':{
                required : false,
                type:Function,
            },
            'span-method':{
                required : false,
                type:Function,
            },
            'select-on-indeterminate':{
                required : false,
                Boolean:false,
            }
        },
        data() {
            return {
                tableData:[],
                total:0,
                pagination:{
                    pageNum:1,
                    pageSize:10
                },
                sizeOption:[10,25,50,100] 
            }
        },
        created(){
           this.load();
           console.log(123123);
        },
        watch:{
            pagination:{
                deep: true,
                handler(newValue, oldValue){
                    this.load();
                }
            }
        },
        methods:{
            handleCurrentChange:function(val){
                this.pagination.pageNum = val;
            },
            handleSizeChange:function(val){
                this.pagination.pageSize = val;
            },
            load:function(){
                let s = this.search;
                let d = this.source;
                let that=this;
                console.log(s);
                if(Array.isArray(d)){
                    this.tableData = d;
                    this.total = d.length;
                    return ;
                }
                
                Object.assign(s,this.pagination);
                if(typeof d === 'function'){
                    that.tableData = d(s);
                    return;
                }
                if(typeof d['getData'] === 'function'){
                    d['getData'](s).then(response=>{
                        let {data} = response;
                        let {body,retMsg,retCode} = data;
                        that.tableData = body.data;
                        that.total = body.totalRecord;
                    });
                    return;
                }
            }
        }
    }
</script>