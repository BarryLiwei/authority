<template>
    <el-col class="ueb-search">
        <el-form ref="model" 
        :model="model" 
        label-width="80px"
        v-on:search="handleSearch"
        class="form-control">
            <slot></slot>
            <!--主要定义了查询按钮-->
            <el-button class="select_button" size="mini" @click="handleReset()">重置</el-button>
            <el-button type="primary" size="mini" @click="search()">查询</el-button>
            <el-button type="text" size="mini" @click="batchSearch()">批量查询</el-button>
        </el-form>
        <!-- 批量查询弹出框 -->
    </el-col>
</template>

<script>
    export default{
        name:'ueb-search',
        props:{
            model:{
                type:Object,
                default:()=>{}
            },
            handleSearch:{
                type:Function,
                default:(obj)=>{}
            }
        },
        data(){
            backup:{}
        },
        created(){
            this.backup = JSON.parse(JSON.stringify(this.model));
        },
        methods:{
            handleReset:function(){
                this.model = Object.assign(this.model, this.backup);
                this.handleSearch(model);
            },
            search:function(){
                this.handleSearch(this.model);
            },
            batchSearch:function(){
                //批量查询

            }
        }
    }
</script>