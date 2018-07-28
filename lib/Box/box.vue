<template>
        <div class="ueb-chunk">
            <div class="ueb-chunk__header"  >
                <slot name="title">
                    <span class="ueb-chunk__title" @click="openBox">{{title}}</span>
                </slot>
                <i :class="{'el-icon-arrow-up': !open, 'el-icon-arrow-down': open}" v-if="close" style="cursor:pointer" @click="openBox"></i>
                <slot name="edit" class="icon_left">
                    <!-- $emit('save')-->
                </slot>
            </div>
            <div class="ueb-chunk__body" v-show="open" :style="style">
                <el-form class="ueb-chunk__form" 
                    ref="Form" 
                    v-bind="$attrs" 
                    v-on="$listeners" size="mini" 
                    label-width="130px"
                     v-if="$slots.right && isForm === true">
                    <el-row class="">
                        <el-col :span="12" class="ueb-chunk__left">
                            <slot></slot>
                        </el-col>
                        <el-col :span="12" class="ueb-chunk__right">
                            <slot name="right"></slot>
                        </el-col>
                    </el-row>
                </el-form>
                <div v-else-if="$slots.right && isForm !== true" class="ueb-chunk__form">
                    <el-row class="">
                        <el-col :span="12" class="ueb-chunk__left">
                            <slot></slot>
                        </el-col>
                        <el-col :span="12" class="ueb-chunk__right">
                            <slot name="right"></slot>
                        </el-col>
                    </el-row>
                </div>
                <div v-else>
                    <slot></slot>
                </div>
            </div>
            <div class="ueb-chunk__line" v-show="!open"></div>
        </div>
    </template>
    <script>
        import ElForm from 'element-ui/lib/form'
           
        export default{
            name:'ueb-box',
            props:{
                title:{
                    type:String,
                    default:''
                },
                isOpen:{
                    type:Boolean,
                    default:true
                },
                isForm:{
                    type:Boolean,
                    default:true
                },
                border:{
                    type:Boolean,
                    default:true
                }
            },
            data(){
                return {
                    open:true
                }
            },
            computed:{
                close(){
                    if(this.isOpen === true){
                        return typeof this.title !=='undefined'&&this.title!==null&&this.title!==''
                    }
                    return false
                },
                style(){
                    let style = {}
                    if(this.border !== true){
                        style.border = 'none'
                    }
                    return style
                }
            },
            created(){
               
            },
            methods:{
                openBox(){
                    if(!this.close){
                        return 
                    }
                    if(this.open){
                        this.open=false
                    }else{
                        this.open=true
                    }
                },
                edit(){
                    this.$emit('edit')
    
                }
            }
        }
    </script>
    <style lang="less" scoped>
        .ueb-chunk{
            padding: 0 10px 5px 5px;
            .ueb-chunk__title{
                font-size: 15px;
                font-weight: 600;
                cursor:pointer;
            }
          
        }
        .ueb-chunk__body{
            border: 1px solid #e4eaec;
            border-radius: 4px;
            margin: 15px 0 30px;
            padding: 20px 10px;
        }
        .ueb-chunk__line{
            padding: 20px 10px;
            border-bottom: 1px solid #e4eaec;
        }
        .ueb-chunk__left{
            border-right: 1px solid #e4eaec;
        } 
    </style>