<template>
     <el-button
        class="ueb-btn__edit"
        type="primary"
        v-bind="$attrs" 
        v-on="$listeners"                
        ><slot>保 存</slot>
        </el-button>
</template>
<script>
import ElButton from 'element-ui/lib/button'

export default {
     name:'ueb-btn-edit',
     props:{
        
     },
     data(){
         return {
             
         }
     }
}
</script>
<style lang="less" scoped>
    .ueb-btn__edit{
        background-color: #5b81fe;
        color: #fff;
        border-color: #5b81fe;
    }
    /deep/ .el-button--primary:active {
        background: #5b81fe;
        color: #fff;
        border-color: #5b81fe;
    }
    /deep/ .el-button--primary:focus, .el-button--primary:hover {
        background: #5b81fe;
        color: #fff;
        border-color: #5b81fe;
    }
</style>


