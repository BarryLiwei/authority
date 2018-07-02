<template>
    <el-col class="ueb-tabs">
        <ul class="ueb-tabs-ul">
            <li v-for="(item,index) in data"
                :class="{active:currentMenu.id === item.id}"                 
                :key="'cache-path-'+index">
                <router-link :to="item.url || '/'" v-on:click.native="handleClick(item)">{{item.title}}</router-link>
                <el-button v-if="data.length>1" type="text"  @click="handleClose(item)"><i class="el-icon-error"></i></el-button>
                <span v-if="currentMenu.id === item.id"></span>
            </li>
        </ul>  
    </el-col>
</template>
<script>
    export default{
        name:'menu-tabs',
        props:{
            cachePath:{
                type:Array,
                default:()=>[]
            }
        },
        data(){
            return {
                data:this.cachePath,
                currentMenu:{}
            }
        },
        created(){
            if(Array.isArray(this.data) && this.data.length>0){
                let flag = false
                for(let i in this.data){
                    let obj=this.data[i]
                    if(obj.checked == true){
                        this.currentMenu=obj
                        flag=true
                        break
                    }
                }
                if(flag === true){
                    this.currentMenu=this.data[0]
                }
            }else{
                let defaultMenu={title:'主页',id:'-main',url:'/',df:true}
                this.currentMenu=defaultMenu;
                this.data=[]
                this.data.push(defaultMenu)
            }           
        },
        methods:{
            handleClick(obj){
                console.log('skip123') 
                if(obj.id === this.currentMenu.id){
                    return;
                }
                this.currentMenu = obj
                this.$emit('skip',obj,this.data)
            },
            handleClose(obj){   
               let index = this.data.indexOf(obj)
               if(index!==-1){
                    if(obj.id === this.currentMenu.id){
                        if(index >=1){
                            this.currentMenu = this.data[index-1]
                        }else{
                            this.currentMenu = this.data[index+1]
                        }
                    }
                    this.data.splice(index,1)
               }
               this.$emit('close',obj,this.data) 
            },
            skip(obj){ 
                this.currentMenu = obj
                let flag=false
                this.data.forEach(item=>{
                    item.checked=false
                    if(item.id === obj.id){
                        flag=true
                    }   
                })
                obj.checked=true
                if(flag ===false){
                    this.data.push(obj)
                }
                if(typeof obj.url!== 'undefined' && obj.url!==null && obj.url!==''){
                    this.$router.push(obj.url)
                }
            }
        }
    }
</script>
<style scoped lang="less">

.ueb-tabs{
    height:60px;
    background:#f5f8fc;
    margin: 0; 
  
    ul{
        height: 40px;
        background:#ffffff;
        li{
            width:120px;
            text-align:center;
            line-height:40px;
            float:left;
            position: relative;
            span{
                display:block;
                width:0;
                height:0;
                border-width:10px 20px 0;
                border-style:solid;
                border-color:#ffffff transparent transparent;
                position: absolute;
                left:44px;

            } 
        }
        .active{
            font-weight: 100;
            color:#5b81fe;
            
        }
    }
}
</style>