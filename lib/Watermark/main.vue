<!--添加水印-->
<template>
    <canvas id = "watermark" width = "160px"  height = "100px">

    </canvas>
</template>
<script>
    export default{
        name:'watermark',
        props:{
            width:{
                type:[Number,String],
                default:160
            },
            height:{
                type:[Number,String],
                default:100
            },
            
        }
    }
</script>