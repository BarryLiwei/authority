<template>
    <el-row class="ueb-search m20">
        <el-form
            size="mini"           
            class="form-control"
            v-bind="$attrs"
            v-on="$listeners"
            :inline="true"
            style="width:100%;"
            ref="searchForm">
            <slot></slot>
            <el-form-item class="btns">
               <span v-for="item in support.btns">
                    <el-popover
                        v-if="item.popover !== ''"
                        :key="item.id"
                        placement="bottom"
                        width="500"
                        trigger="click">
                        <div v-if="filtrateType === 1">
                            <el-tabs tab-position="left" style="margin-left:5px;margin-top:20px;height: 200px;overflow: auto;">
                                <el-tab-pane label="常用筛选">常用筛选</el-tab-pane>
                                <el-tab-pane label="搜索">
                                    <el-form label-width="120px" size="mini" style="height: 200px;overflow: auto;">
                                        <el-form-item v-for="item in support.filtrates" :key="'filtrates'+item.id" :label="item.name" style="width: 350px" v-if="typeof item.options !== 'undefined'">
                                            <el-input v-model="support.model[item.id]" type="text"></el-input>
                                        </el-form-item>
                                    </el-form>
                                </el-tab-pane>
                            </el-tabs>
                            <div style="word-break:keep-all;word-wrap:normal;margin-left: 70%;margin-top:10px;">
                                <el-button>取消</el-button>
                                <el-button type="primary" >确定</el-button>
                            </div>
                        </div>
                        <div v-else>
                            <el-form ref="form" size="mini" style="margin-left:5px;margin-top:20px;height: 200px;overflow: auto;">
                                <custom-condition 
                                    ref="customCondition"
                                    :data="support.filtrates"
                                    :support="support1"
                                    :is-remove="true" 
                                    value-style="width:200px">
                                </custom-condition>
                            </el-form>
                            <el-button type="text"  size="mini" icon="el-icon-plus" >添加条件</el-button>
                            <div style="word-break:keep-all;word-wrap:normal;margin-left: 50%;">
                                <el-button >另存方案</el-button>
                                <el-button>重置</el-button>
                                <el-button type="primary" >查询</el-button>
                            </div>
                        </div>
                        <!--两种格式-->
                        <el-button slot="reference" type="text" size="mini" :type="item.type" :icon="item.icon" style="margin-right: 10px;">{{item.name}}</el-button>
                    </el-popover>
                    <el-button v-else 
                        :type="item.type"
                        :icon="item.icon"
                        :key="item.id"
                        size="mini"
                        style="margin-right: 10px;"
                        @click="handleClick(item.id)">
                        {{item.name}}
                    </el-button>
               </span>
            </el-form-item>
        </el-form>
        <el-col class="labels" v-if="searchTag.length > 0" >
            <div class="labels_l">
                    <!-- label 标签-->
                    <el-tag
                        v-for="tag in searchTag"
                        :key="tag.name"
                        closable
                        size="small"
                        @close="clearTag(tag)"
                        type="info">
                        <span class="tag-title">{{tag.name}} : </span>
                        <span class="tag-value">{{tag.mark}}{{tag.value}}</span>
                    </el-tag>
                    <el-button type="text" v-if="searchTag.length > 0" @click="clearTag('all')">清除</el-button>
            </div>
        </el-col>
        <!-- 批量查询弹出框 -->
        <el-dialog title="批量查询" 
            :visible.sync="visible"
            ref="batchDialog"
            class="batchs"
            width = '30%'
            append-to-body>
            <div class="multiple_choice">
                <el-radio-group v-model="searchObj.fields">
                    <el-radio 
                         v-for="item in support.batchs"
                        :key = "item.id" 
                        :label = "item.id">
                        <span class="radio-title" style="width:100px;overflow:hidden;">按{{item.name}}</span>
                    </el-radio>
                </el-radio-group>
            </div>
            <div class="tips">
                每行一个值(支持excel复制黏贴)
            </div>
            <span class="division"></span>
            <el-input
                type="textarea"
                :rows="14"
                :autosize="false"
                placeholder="请输入内容"
                v-model="searchObj.context">
            </el-input>
            <div slot="footer" class="dialog-footer">
                <el-button @click="cancel">取 消</el-button>
                <el-button type="primary" @click="batchSearch">查询</el-button>
            </div>  
        </el-dialog>     
    </el-row>

</template>

<script>
    import ElForm from 'element-ui/lib/form'

    import SearchData from './dataSupport.js'

    import Support from './../Tab/support.js'

    import customCondition from './../Tab/customCondition'

    export default{
        name:'ueb-search',
        components:{customCondition},
        props:{
            ...ElForm.props,
            btns:{
                type:Array,
                default:()=>['reset','search']
            },
            search_label:{
                type:Boolean,
                default:false
            },
            queryOptions:{
                type:[Array],
                default:()=>[]
            },
            transformFields:{
                type:Function,
                default:(id,obj)=>{}
            },
            model:{
                type:[Object,Array],
                default:()=>{return {}}
            },
            filtrateType:{
                type:[String,Number],
                default:1
            },
            support1:{
                type:Support,
                default:()=>{return new Support(this.queryOptions,[],'')}
            }
        },
        data(){
            return { 
                searchTag:[],
                support: new SearchData(this.queryOptions,this.model),
                visible:false,
                searchObj:{
                    fields:'',
                    context:''
                }
            }     
        },
        created(){
            console.log('filtrates',this.support.filtrates,this.filtrateType)
            console.log('init',this.support)
        }, 
        methods:{          
            clearTag(obj){
                this.searchTag = this.support.clearTag(this.searchTag,obj,this.model)
                this.$emit('handle-search','search',this.model)
            }, 
            handleClick(id){
                var that = this;
                //按钮点击事件
                switch(id){
                    case 'reset':
                        this.clearTag('all')
                        break;
                    case 'search':
                        that.search()
                        break;
                    case 'batch':
                        that.batch()
                        break;
                    default:
                        break;
                }
            }, 
            search(){
                this.searchTag = this.support.builderTag(this.model,this.transformFields)
                //查询
                this.$emit('handle-search','search',this.model)
            },
            batch(){
                var fields = this.searchObj.fields;
                if(this.support._isEmpty(fields)){
                    //获取默认值 (第一个)
                   if(this.support.batchs.length>0){
                        let obj = this.support.batchs[0];
                        this.searchObj.fields = obj.id
                    }
                }  
                this.batchBackups = Object.assign({},this.searchObj);           
                //TODO 页面初始化
                this.visible = true;
            },
            cancel(){
                Object.assign(this.searchObj,this.batchBackups);
                this.visible = false;
            },
            filtrate(){
                //筛选
            },
            batchSearch(){
                this.searchTag = this.support.builderTag(this.model,this.transformFields)
                this.$emit('handle-search','batch',this.searchObj)
                this.visible = false;
            }
        }
    }
</script>

<style lang="less" >
    
    .ueb-search{
        width:100%;
        margin-top:10px;
        border-bottom:1px solid #e4eaec;
        .el-form--inline{
            float:left;       
        }
        .labels{
            width:98%;
            margin-bottom:20px;
            .labels_l{
                float:left;
                .qyzt{
                    height:28px;
                    color:#a3aab7;
                    border:1px solid #dcdfe6;
                    padding:0 30px 0 10px;
                    max-width:350px;
                    display:inline-block;
                    overflow: hidden;
                    text-overflow:ellipsis;
                    white-space: nowrap;
                    position: relative;
                    span{
                        color:#373e4f;
                        text-align:left;

                    }
                    .el-icon-close{
                        position:absolute;
                        right:10px;
                    }
                }
            }
        }
        .main_m{
            width:98%;
            overflow: hidden;
            .main_l{
                float:left;
                margin-top:20px;
                span{
                    font-size:14px;
                    padding:0 5px;
                    cursor: pointer;
                    &:hover {
                        color: #409EFF;
                    }
                }
                .border_r{
                    border-right:1px solid #dcdfe6;
                    padding-right:8px;
                }

            }
            .main_r{
                float:right;
                .el-dropdown{
                    float: right;
                    margin-right:15px;
                    margin-top:11px;
                }
            }
            
        }

        .el-tag{
            margin-right:10px;
            background-color: white;
            border-color:#ecf1f4;
            .tag-title{
                color: #8d92a1;
            }
            .tag-value{
                color: #1e232b;
            }
            
        }
    }
    .m20{
        margin:20px 20px 0 20px;
       
    }

    .batchs{
        .multiple_choice{
            width:100%;
            overflow: hidden;
            margin-bottom: 5px;
            .radio-title{
                margin-right:20px;
                overflow:hidden; 
                text-overflow:ellipsis; 
                white-space:nowrap; 
                word-break:keep-all;
            }
            .el-radio{
                margin-left:0px;
                margin-bottom: 10px;
               
            }
        }
        .tips{
            margin-bottom:8px;
        }
        .el-textarea__inner{
            resize:none;
        }
    }
</style>    