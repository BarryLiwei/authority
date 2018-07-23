<template>
    <div class="container">
        <slot v-if="zc"></slot>
        <div v-else>
            No!骚年 你没权限
        </div>
    </div>
</template>
<script>
    let filtrations = ['el-pagination']
    export default{
        name:"ueb-main",
        props:{
            //自动推送权限(会自动把页面上需要推送的按钮 或者 带permissions标签的元素推送推送到后端) table内点击事件会做特殊处理
            pushPermissions:{
                type:Boolean,
                default:true
            },
            //校验权限(所有带 click 事件的都会校验权限 如果没有权限 则拦截点击事件[或者设置 disabled=true])
            checkPermissions:{
                type:Boolean,
                default:true
            },
            //地址权限(如果开启 则不能通过url直接访问页面[没有打开header页面 或者没有在当前菜单里面配置的url 无法打开])
            addressPermissions:{
                type:Boolean,
                default:false 
            },
            props:{
                type:Object,
                default:()=>{
                    return {'404':''}
                }
            }, 
            filtration:{
                type:Array,
                default:()=>[]
            } 
        },
        data(){
            return {
                permissions:[],
                filtrations:this.filtration,
                zc:true
            }
        },
        created(){
            this.filtrations = this.filtrations.concat(filtrations)
        },
        mounted(){
            this.$nextTick(function () {
                console.log(this)
                let {$children} = this
                this.recursion($children)
                console.log(this.permissions)
            })
        },
        methods:{
            recursion(vue){
                if(Array.isArray(vue)&&vue.length>0){
                    vue.forEach(item=>{
                        let {$children,$attrs,permissions,_vnode,$options,$el,$vnode} = item
                        let {click} = $attrs
                        if(typeof _vnode !=='undefined'){
                            
                        }
                        if(typeof $options !=='undefined'){
                            let {_parentListeners} = $options
                            if(typeof _parentListeners!=='undefined'){
                                let {click} = _parentListeners
                                if(typeof click === 'function'){
                                  
                                   if ($el.removeEventListener) {
                                        //  $el.addEventListener("click", (e)=>{
                                           
                                        //      return false
                                        //  });
                                   }else if ($el.detachEvent){
                                        // $el.detachEvent("click", (e)=>{
                                           
                                           
                                        //      return false
                                        //  });
                                   } 
                                    this.permissions.push(item)
                                }
                            }
                        }
                        if(typeof permissions!=='undefined' || typeof click === 'function'){
                            console.log('permissions',$el.innerText)
                            this.permissions.push(item)
                        }
                        if(typeof $vnode !=='undefined'){
                            let {componentOptions} = $vnode
                            if(typeof componentOptions!== 'undefined'){
                                let {tag} = componentOptions
                                //过滤掉无需权限的节点
                                if(this.filtrations.indexOf(tag) !== -1){
                                    console.log(this.filtrations,tag)
                                    return 
                                }
                            }
                        }
                        this.recursion($children)
                    })
                }
            }
        }
    }
</script>