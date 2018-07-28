<template>
     <el-button  
        size="small"      
        class="ueb-btn__add"        
        v-bind="$attrs" 
        v-on="$listeners"
        ><slot>新 增</slot>
        </el-button>
</template>
<script>
import ElButton from 'element-ui/lib/button'

export default {
     name:'ueb-btn-add',
     props:{
        
     },
     data(){
         return {
             
         }
     }
}
</script>
<style lang="less" scoped>
    .ueb-btn__add{
        background-color: #48d9a1;
        border-color: #48d9a1;
        color: #fff;
    }
    /deep/ .el-button:active {
        background-color: #48d9a1!important;
        border-color: #48d9a1!important;
        color: #fff!important;
    }
    /deep/ .el-button:focus, .el-button:hover {
        background-color: #48d9a1!important;
        border-color: #48d9a1!important;
        color: #fff!important;
    }
    .el-button:focus, .el-button:hover {
        background-color: #48d9a1 !important;
        border-color: #48d9a1 !important;
        color: #fff !important;
    }
</style>


