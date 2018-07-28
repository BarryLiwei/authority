<template>
        <div class="ueb_textarea">
            <el-input  v-bind="$attrs" v-on="$listeners"  type="textarea" v-model="val"></el-input>
            <div class="text__input" 
            v-if="typeof $attrs.maxlength !=='undefined' && $attrs.maxlength !== null && $attrs.maxlength>0">
            {{wordCount}}/{{$attrs.maxlength}}</div>
            <span v-if="textError" class="text__error">描述字数长度只能输入300个字符</span>
        </div>
    </template>
    <script>
    
        import ElInput from 'element-ui/lib/input'
    
        export default{
            name:'ueb-textarea',
            props:{
                value:[String],
                isCount:{
                    type:Boolean,
                    default:true
                },
                tip:{
                    type:Boolean,
                    default:false
                }
            },
            data(){
                return {
                    val:this.value,
                    textError:false,
                }
            },
            
            watch:{
                val(value){
                    this.$emit('input',value)
                },
                value(val){
                    this.val = val
                    if(this.tip === true){
                        if( this.val.length >= this.$attrs.maxlength) {
                            this.$message.error('描述字数长度只能输入'+this.$attrs.maxlength+'个字符');
                        }else{
                            this.textError = false;
                        }
                    }     
                }
            },
            computed:{
                wordCount(){
                    return this.value?this.value.length: 0;
                },
            }
        }
    </script>
    
<style lang="less" scoped>
    .ueb_textarea {
    position: relative;
    /deep/ .el-textarea__inner {
        border: 1px solid transparent !important;
    }
    /deep/ .el-textarea {
        padding-bottom: 18px;
        border:1px solid #dcdfe6;
        /deep/textarea{
        height: 70px;
        border: 0px solid #fff;
        }
        /deep/.el-textarea__innerr{
            border: 1px solid transparent;
        &:foucs {
            border:0px solid #dcdfe6;
        }
        &:hover {
            border:0px solid #dcdfe6;
        }
        }
    }
    .text__input{
    position: absolute;
    right: 1px;
    right: 0;
    bottom: 5px;
    height: 12px;
    line-height: 12px;
    }
    .text__error {
    position:absolute;
    color: #f56c6c;
    font-size: 12px;
    height: 20px;
    left:0;
    line-height: 20px;
    }
}
</style>