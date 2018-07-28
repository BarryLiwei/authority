<template>
     <el-button
        class="ueb-btn__confirm"
        type="primary"
        v-bind="$attrs" 
        v-on="$listeners"                
        ><slot>确 定</slot>
        </el-button>
</template>
<script>
import ElButton from 'element-ui/lib/button'

export default {
     name:'ueb-btn-confirm',
     props:{
        
     },
     data(){
         return {
             
         }
     }
}
</script>
<style lang="less" scoped>
    .ueb-btn__confirm{
        background-color: #5b81fe;
        border-color: #5b81fe;
        color: #fff;
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


