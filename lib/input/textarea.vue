<template>
    <span>
        <el-input  v-bind="$attrs" v-on="$listeners"  type="textarea"></el-input>
        <div class="remark-input" style="float: right;margin-right: 4px;" 
        v-if="typeof $attrs.maxlength !=='undefined' && $attrs.maxlength !== null && $attrs.maxlength>0">{{wordCount}}/{{$attrs.maxlength}}</div>
    </span>
</template>
<script>

    import ElInput from 'element-ui/lib/input'

    export default{
        name:'ueb-textarea',
        props:{
            value:String,
            isCount:{
                type:Boolean,
                default:true
            }
        },
        data(){
            return {

            }
        },
        computed:{
            wordCount(){
                return this.value?this.value.length: 0;
            },
        }
    }
</script>