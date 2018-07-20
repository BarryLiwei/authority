<template>
    <div class="ueb-box-item">
        <label :style="{width:labelWidth}" class="ueb-box-item__title">{{label}}</label>
        <div class="ueb-box-item__content" :style="{'margin-left':labelWidth}">
            <slot></slot>
        </div>
    </div>
</template>
<script>
    export default{
        name:'ueb-box-item',
        props:{
            labelWidth:{
                type:String,
                default:'120px'
            },
            label:String,
        }
    }
    
</script>

<style lang="less" scoped>
    .ueb-box-item{
        margin-bottom: 10px;
        float:left;
        .ueb-box-item__title{
            text-align: right;
            vertical-align: middle;
            float: left;
            font-size: 14px;
            color: #606266;
            line-height: 40px;
            padding: 0 12px 0 0;
            -webkit-box-sizing: border-box;
            box-sizing: border-box;
        }
        .ueb-box-item__content{
            line-height: 28px;
            font-size:14px;
        }
    }
</style>