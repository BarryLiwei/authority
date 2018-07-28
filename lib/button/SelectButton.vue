<template>
     <el-button
        :size="size"
        class="ueb-btn__select"        
        v-bind="$attrs" 
        v-on="$listeners"                
        ><slot>查询</slot>
        </el-button>
</template>
<script>
import ElButton from 'element-ui/lib/button'

export default {
     name:'ueb-btn-select',
     props:{
         size:{
             type:String,
             default:'mini'
         }
     },
     data(){
         return {
             
         }
     }
}
</script>
<style lang="less" scoped>
    .ueb-btn__select{
        background-color: #5b81fe;
        border-color: #5b81fe;
        color: #fff;
    }
    /deep/ .el-button:active {
        background-color: #5b81fe !important;
        border-color: #5b81fe !important;
        color: #fff !important;
    }
    /deep/ .el-button:focus, .el-button:hover {
        background-color: #5b81fe !important;
        border-color: #5b81fe !important;
        color: #fff !important;
    }
    .el-button:focus, .el-button:hover {
        background-color: #5b81fe !important;
        border-color: #5b81fe !important;
        color: #fff !important;
    }
</style>


