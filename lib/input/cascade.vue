<template>
    <el-row class="reason_container">
        <el-button class="inventory_btn" size="small" @click="visible = !visible" :title="title">
            <span v-show="label">{{label}}</span>
            <span  v-show="!label" style="color: #c0c4cc;">{{placeholder}}</span>
            <i class="el-select__caret el-input__icon " :class="{'el-icon-arrow-down':!visible,'el-icon-arrow-up':visible}"></i>
        </el-button>
        <div class="reason_list" v-show="visible" :style="style">
            <!-- <el-table class='el_table_download' :data="options" @selection-change="handleSelectionChange">
                <el-table-column type="selection" width="40"></el-table-column>
                <el-table-column min-width="300" show-overflow-tooltip property="reason" label="全选"></el-table-column>
            </el-table> -->
            <div class="cascade__context" >
                <el-input placeholder="输入关键字进行过滤" 
                    v-model="filterText" 
                    v-if="filterable" 
                    style="width:80%;margin-left: 10%; margin-top: 10px;" 
                    suffix-icon="el-icon-search">
                    
                </el-input>
                <div contenteditable="true" ></div>
                <el-tree
                    style="margin-left: 10%;margin-right: 10%;margin-bottom:10px; "
                    :data="data"
                    show-checkbox
                    ref="Tree"
                    :accordion="!multiple"
                    empty-text="没有数据"
                    :filter-node-method="filterNode"
                    :node-key="valueKey"
                    :props="defaultProps"
                    v-bind="$attrs"
                    v-on="$listeners">
                </el-tree>
            </div>
            <div class="reason_list_foot">
                <el-button  @click="reasonCancel">取消</el-button>
                <el-button type="primary" @click="reasonConfirm" style="margin-right: 20px;">确定</el-button>
            </div>
        </div>
    </el-row>
</template>
<script>
    export default{
        name:'ueb-cascade',

        props:{
            data:{
                type:Array,
                default:()=>[]
            },
            props:{
                type:Object,
                default:()=>{return {}}
            },
            value:Array,
            valueKey:{
                type:String,
                default:'value'
            },
            labelKey:{
                type:String,
                default:'label'
            },
            childrenKey:{
                type:String,
                default:'children'
            },
            title:{
                type:String,
                default:'请选择'
            },
            separator:{
                type:String,
                default:'/'
            },
            popperClass:String,
            placeholder:{
                type:String,
                default:'请选择'
            },
            disabled:{
                type:Boolean,
                default:false
            },
            clearable:{
                type:Boolean,
                default:false
            },
            expandTrigger:{
                type:String,
                default:'click'
            },
            showAllLevels:{
                type:Boolean,
                default:true 
            },
            filterable:{
                type:Boolean,
                default:false 
            },
            multiple:{
                type:Boolean,
                default:false
            },
            zIndex:{
                type:Number,
                default:200
            },
            reception:{
                type:[Array,Object]
            }
        },
        data(){
            return {
                visible:false,
                filterText:'',
                label:'',
                defaultProps:{
                    label:this.labelKey,
                    children:this.childrenKey,

                }
            }
        },
        computed:{
            style(){
               let zIndex = this.zIndex <1?200:this.zIndex 
               let style={'z-index':zIndex}
               return style
            }
        },
        watch:{
            visible(val){
                if (val) {
                    this.$emit('open');
                }else{
                    this.$emit('close');
                } 
            },
            filterText(val) {
                this.$refs.Tree.filter(val)
            }
        },
        mounted(){
            document.addEventListener('click',(e)=>{
                if(this.visible){
                    if(!this.$el.contains(e.target)){
                        this.visible = false
                    }
                }
            })
        },
        methods:{
            handleSelectionChange(){

            },
            reasonConfirm(){
                let vals = this.$refs.Tree.getCheckedNodes()
                let arr = []
                let arr1 = []
                if(Array.isArray(vals) && vals.length>0){
                    vals.forEach(item=>{
                        arr.push(item[this.valueKey]) 
                        arr1.push(item[this.labelKey])
                    })
                }
                this.label = arr1.join(',')
                
                this.$emit('input',arr)
                this.$emit('update:reception',vals)
                this.visible = false
            },
            reasonCancel(){
                this.visible = false
            },
            getTree(){
                return this.$refs.Tree
            },
            filterNode(value, data) {
                if (!value) return true;
                return data.label.indexOf(value) !== -1;
            }
        }
    }
</script>
<style lang="less" scoped>
.reason_container {
    position: relative;
    width:100%;
    .reason_list {
        width:100%;
        max-width: 908px;
        position: absolute;
        margin-top: 8px;
        background: #fff;
        border:1px solid #ebeef5;
        box-shadow:0 2px 12px 0 rgba(0,0,0,.1);
    }
    .cascade__context{
        border:1px solid #ebeef5;
        margin: 10px 10px 10px 10px;
        
    }
    .inventry_list {
        right: 0;
        max-width: 945px;
        padding: 20px 25px;
    }
    .reason_list_foot {
        text-align: right; 
        width:100%;
        height: 60px;
        line-height: 60px;
    }
    .inventory_btn {
        width: 100%;
        span {
            display: inline-block;
            max-width: 970px;
        }
        i {
            position: absolute;
            right: 15px;
            top: 0px;
        }
    }
} 

.reason_container .inventory_btn /deep/ span {
    display: inline-block;
    max-width: 835px;
    font-size: 13px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    padding-top: 1px;
    height: 20px;
    line-height: 20px;
    }
    .inventory_btn:focus, .inventory_btn,.inventory_btn:focus, .inventory_btn:hover{
    color:#606266;
    font-size:12px;
    background: #fff;
    border: 1px solid #dcdfe6;
    margin-right:10px;
    max-width: 908px;
    text-align:left;
    padding: 5px 20px;
}

.inventory_btn /deep/ .el-input__icon{
    line-height: 25px;
}
</style>