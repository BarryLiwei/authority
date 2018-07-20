<template>
    <el-row class="operation">
        <el-col :span="span" class="operation-left">
            <slot></slot>
        </el-col>
        <el-col :span="12" class="operation-right" >
            <el-dropdown @command="handleExport">
                <el-button plain style="width: 100px;" size="mini" class="el-dropdown-link">
                    导入导出<i class="el-icon-arrow-down el-icon--right"></i>
                </el-button>
                <el-dropdown-menu style="width: 130px;margin-right: -30px;" slot="dropdown">
                    <el-dropdown-item command="imp">导入</el-dropdown-item>
                    <el-dropdown-item command="exp">导出所有文件</el-dropdown-item>
                </el-dropdown-menu>
            </el-dropdown>
            <slot name="right"></slot>
        </el-col>
        <export :headOptions="columns" @cancel="handleCloseExport" @save="handleSave" ref="uebExport" :visible.sync="show.exp"></export>
    </el-row>
</template>

<script>
   import Export from "./Export.vue"

    export default{
        name:'ueb-export',
        components:{Export},
        props:{
            span:{
                type:Number,
                default:12
            },
            tableRef:{
                type:[Object]
            },
            data:{
                type:Array,
                default:()=>[]
            },
            path:{
                type:String,
                default:''
            },

        },
        data(){
            return {
                show:{
                    exp:false,
                    imp:false
                },
                columns:[]
            }
        },
        computed:{
           
        },
        methods:{
            getColumns(){
                let result = []
                if(typeof this.tableRef !== 'undefined'){
                    let refs=this.tableRef.$refs
                    if(typeof refs !== 'undefined'){
                        let tables = refs.uebTable
                        if(tables!=='undefined'){
                            let columns = tables.columns
                            if(Array.isArray(columns)){
                                columns.forEach(item=>{
                                    let {label,property}=item
                                    if(typeof property !=='undefined' && property!==null && property!==''){
                                        result.push({field:property,title:label})
                                    }
                                })
                            }
                        }else{
                            let columns = refs.columns
                            if(Array.isArray(columns)){
                                columns.forEach(item=>{
                                    let {label,property}=item
                                    if(typeof property !=='undefined' && property!==null && property!==''){
                                        result.push({field:property,title:label})
                                    }
                                })
                            }
                        }
                    }
                }
                if(Array.isArray(this.data)){
                    this.data.forEach(item=>{
                        let {field,title} = item
                        let flag=false
                        for(let i in result){
                            let {field:a,title:b} = result[i]
                            if(a === field){
                                flag=true
                                result.slice(i,1,item)
                                break;
                            }
                        }
                        if(!flag){
                            result.push(item)
                        }
                    })
                }
                return result
            },
            handleExport(command){
                Object.keys(this.show).forEach(item=>{
                    this.show[item]=false
                })
                if(command === 'exp'){
                    this.columns=this.getColumns()
                    console.log(this.columns)
                }
                this.show[command]=true
            },
            handleCloseExport(){

            },
            handleSave(){

            }
        }
    }
</script>
<style lang="less" scoped>
.operation{
    height: 50px;
    line-height: 50px;
    .operation-left{
        text-align:left;
        padding:0px;
        margin:0px;
        float: left;   
        *{
            padding: 0 10px;
            font-size: 12px;
            cursor: pointer;
            &:hover {
                color: #5b81fe;
            }
        }
    }
    .operation-right{
        text-align:right;
        padding:0 10px;
        margin:0px;
        float: right;    
    }
}
</style>