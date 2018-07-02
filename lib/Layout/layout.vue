<template>
    <el-container>
        <el-header style="width: 100%;padding:0;height: auto;">
            <el-row class="ueb-header" >
                <el-col :span="2" class="ueb-logo"></el-col>
                <el-col :span="2" class="ueb-system" style="width: 140px;">
                    <el-dropdown trigger="click"  @command="handleCommand">
                        <span class="el-dropdown-link ueb-menu-link" >
                            <span class="menu-text">
                                <i :class="currentSystem.icon" v-if="typeof currentSystem.icon !== 'undefined'"></i>
                                {{currentSystem.title}}<i class="el-icon-caret-bottom el-icon--right"></i>
                            </span>
                        </span>
                        <el-dropdown-menu slot="dropdown">
                            <el-dropdown-item 
                                v-for="(item,index) in systems"
                                :command="item"
                                :class="{isActive:item.id === currentSystem.id}" 
                                :key="'dropdown-item-'+index">
                                <i :class="item.icon" v-if="typeof item.icon !== 'undefined'"></i>{{item.title}}
                            </el-dropdown-item>
                        </el-dropdown-menu>
                    </el-dropdown>
                </el-col>
                <el-col :span="14" class="ueb-menu">
                    <el-menu :default-active="activeIndex"
                        class="ueb-menu"
                        mode="horizontal"
                        background-color="#5b81fe"
                        text-color="#fff"
                        active-text-color="#ffd04b">
                        <el-menu-item 
                            v-for="(item,index) in data"
                            :key="'menu-'+index"
                            :index="item.id">
                            <router-link :to="item.url || '/'" v-on:click.native="handleSkipMenu(item)" v-if="!Array.isArray(item.childs) || (Array.isArray(item.childs) && item.childs.length<1)">
                                <i :class="item.icon" v-if="typeof item.icon !== 'undefined'"></i>
                                <span class="menu-text">{{item.title}}</span>
                            </router-link>
                            <!-- <el-popover v-else
                                width="200"
                                trigger="hover"
                                placement="bottom">
                                <div>
                                    123123
                                </div>
                                <span class="menu-text" slot="reference"><i :class="item.icon" v-if="typeof item.icon !== 'undefined'"></i>{{item.title}}<i class="el-icon-caret-bottom el-icon--right"></i></span>
                            </el-popover> -->

                             <!-- <el-dropdown v-else>
                                <span class="el-dropdown-link"> 
                                    <span class="menu-text"><i :class="item.icon" v-if="typeof item.icon !== 'undefined'"></i>{{item.title}}<i class="el-icon-caret-bottom el-icon--right"></i></span>   
                                </span>
                                <el-dropdown-menu slot="dropdown" style="width: 120px;">

                                </el-dropdown-menu>    
                            </el-dropdown> -->
                            <div @mouseout="handleMouseout(item)" @mouseover="handleMouseover(item)" v-else>
                                <span class="menu-text" ><i :class="item.icon" v-if="typeof item.icon !== 'undefined'"></i>{{item.title}}</span>
                                <transition name="fade">
                                    <el-row @mouseover="handleMouseover1(item)" 
                                            @mouseout="handleMouseout1(item)" 
                                            style="z-index:2010;left:0px;height:100px;max-height: 200px;width:250px;background-color: #fff;position:absolute;border: 1px solid #ebeef5;" 
                                            v-show="currentMenu.id === item.id">
                                      <span v-for="(obj,num) in item.childs" :key="'menu-span-'+num">
                                        <el-col :span="(Array.isArray(obj.childs) && obj.childs.length>0)?8:24" >
                                            <el-button type="text" @click="handleSkipMenu(obj)" style="float: left;margin-left: 20px;">
                                                <i :class="obj.icon" v-if="typeof obj.icon !== 'undefined'"></i>{{obj.title}}
                                            </el-button>
                                        </el-col>
                                        <el-col :span="16" v-if="Array.isArray(obj.childs) && obj.childs.length>0">
                                            <el-button type="text" v-for="(o,n) in obj.childs"
                                                @click="handleSkipMenu(o)"
                                                style="float: left;margin-left: 20px;"
                                                :key="'menu-button-'+n">
                                                <i :class="o.icon" v-if="typeof o.icon !== 'undefined'"></i>{{o.title}}
                                            </el-button>
                                        </el-col> 
                                      </span>
                                    </el-row>
                                </transition>
                            </div>    
                        </el-menu-item>
                    </el-menu>
                </el-col>
                <el-col :span="6" class="ueb-system">
                    <el-menu class="ueb-system-menu"
                        mode="horizontal"
                        background-color="#5b81fe"
                        text-color="#fff"
                        active-text-color="#ffd04b">
                        <el-menu-item index="phone" class="ueb-system-menu-item">
                            <h3><i class="ueb-icon-customer" style="opacity:1;color: #fdfeff;"></i>400-800-123456789</h3>
                        </el-menu-item>
                        <el-menu-item index="company"  class="ueb-system-menu-item">环金科技</el-menu-item>
                        <el-menu-item index="userInfo"  class="ueb-system-menu-item">小黑</el-menu-item>  
                    </el-menu>
                </el-col> 
            </el-row>
        </el-header>
        <el-main class="ueb-main">
            <menu-tabs :cache-path="cachePath" @skip="handleSkip" ref="menuTabs"></menu-tabs>
            <div class="ueb-main-context">
                <slot></slot>
            </div>
        </el-main>        
    </el-container>
</template>
<script>
    import menuTabs from './MenuTabs'
    export default{
        name:'ueb-layout',
        components:{menuTabs},
        props:{
            data:{
                type:Array
            },
            cachePath:{
                type:Array
            },
            systems:{
                type:Array
            }
        },
        data(){
            return{
                activeName:'',
                activeIndex:'',
                systemName:'',
                secondMenu:[],
                currentSystem:{},
                currentMenu:{},
                config:{
                    mouseover:false,
                    mouseover1:false
                }
            }
        },
        computed: {
            key () {
                return this.$route.name !== undefined ? this.$route.name + +new Date() : this.$route + +new Date();
            }
        },
        created(){
            if(this.data.length>0){
                this.systemName = this.data[0].title
                this.secondMenu = this.data[0].childs
                this.activeIndex = this.data[0].id
               
            }
            if(this.systems.length>0){
                this.currentSystem = this.systems[0]
            }
        },
        methods:{
            handleMouseover1(obj){
                this.currentMenu = obj
                this.config.mouseover1=true
            },
            handleMouseover(obj){
                this.currentMenu = obj
                this.config.mouseover=true
            },
            handleMouseout(obj){
                if(this.config.mouseover1 !==true){
                    this.currentMenu={}
                }
            },
            handleMouseout1(obj){
                if(this.config.mouseover !==true){
                    this.currentMenu={}
                } 
            },
            handleSkipMenu(obj){
                this.$refs.menuTabs.skip(obj)
            },
            handleSkip(obj){ 
                this.$emit('skip',obj)
            },
            handleCommand(obj){
                this.currentSystem = obj
                this.$emit('change-system',obj)
            }
        }
    }
</script>
<style lang="less" scoped>
    .el-dropdown-menu__item.isActive{
        color:#66b1ff
    }
    .ueb-header{
        padding:0;
        width: 100%;
        background-color:#5b81fe;
        white-space:nowrap;
        .ueb-logo{
            margin-left:5px; 
            height: 60px;
            width:110px;
            line-height: 60px;
            background-size: auto;
            background: url("../assets/logo.png") no-repeat;
            background-position: 0 center;
            &:hover {
                background-color: transparent;
            }
        }
        .ueb-menu{
            border-bottom:none;
        }       
    }
    .ueb-menu-link{
        height: 60px;
        line-height: 60px;
    }
    .menu-text{
        font-weight:bold;
        font-size:17px;
        color: rgb(255, 255, 255);
    }
    .ueb-system-menu-item{
        border-bottom-color:transparent !important;
    }
    
    .ueb-main{
        padding:0;
    }
    
    .ueb-main-context{
        background-color: #ebeef5;
        margin-top:60px;
    } 
</style>