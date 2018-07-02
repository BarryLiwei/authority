<template>  
    <div class="ueb-tabs">
         <el-tabs type="card" 
            v-model="activeName"
            ref="scheme"
            :addable="false"
            @tab-remove="removeTabs"  
            @tab-click="handleClick"
            active-name="add">
            <el-tab-pane v-for="(item,ix) in tabData"
                v-if="ix < 3 "
                :key="item.id"
                :label="item.name"
                :closable="item.df !== true"
                :name="item.id">
                <ueb-search
                    :query-options="support.fields"
                    :transform-fields="transformFields"
                    filtrate-type="2"
                    :support1="support"
                    :model="item.searchs">
                    <custom-condition 
                        ref="customCondition"
                        :data="item.searchs"
                        :support="support"
                        :is-remove="false"
                        :max="3" 
                        field-style="max-width:25%;" 
                        @change-field="fieldChange">
                    </custom-condition>
                </ueb-search>
            </el-tab-pane>
            <el-tab-pane name="more" class="more" v-if="more">
                <div class="more-btn">  
                    <el-dropdown trigger="click" @command="dropdownClick">
                        <el-button type="text">
                            更多选项  
                            <i class="el-icon-arrow-down el-icon--right"></i>
                            <el-badge class="item" :value="data.length - 3" />
                        </el-button>
                        <el-dropdown-menu slot="dropdown"> 
                            <el-dropdown-item 
                                v-for="(item,index) in tabData"
                                :key="'dropdown_item'+index"
                                :command="item"
                                v-if="index > 2 ">
                                {{item.name}}
                                <el-button type="text" @click="removeTabs(item.id)">
                                    <i class="el-icon-close el-icon--right" ></i>
                                </el-button>
                            </el-dropdown-item>    
                        </el-dropdown-menu>
                    </el-dropdown>
                </div>
                <!-- <custom-condition 
                    ref="customCondition"
                    :data="item.searchs"
                    :support="support"
                    :is-remove="false"
                    :max="3" 
                    field-style="width:25%;" 
                    @change-field="fieldChange">
                </custom-condition> -->
            </el-tab-pane>
            <el-tab-pane name="add" class="add">
                <span slot="label" class="add-btn">
                    <i class="el-icon-plus"></i>
                </span>
            </el-tab-pane>
            <slot></slot>
        </el-tabs>  
        <add-pane :support="support" ref="addPane" @save="handleSave">

        </add-pane>
    </div>
</template>

<script>
   import Support from './support.js'


   import addPane from './addPane'
   
   import customCondition from './customCondition'
   
    export default{
        name:'ueb-tabs',
        components:{customCondition,addPane},
        props:{
            defaultName:{
                type:String,
                default:'默认方案'
            },
            fields:{
                type:Array,
                default:()=>[]
            },
            data:{
                type:Array,
                default:()=>[]
            }
        },
        data(){
            return {
                activeName:'',
                tabData:[],
                more:false,
                search:{},
                visible:true,
                formModel:{},
                support:new Support(this.fields,this.data,this.defaultName)
            }
        }, 
        mounted(){
            this.tabData = this.support.data
            this.activeName = this.currentName = this.tabData[0].id
            console.log(this.support.fields)
        }, 
        methods:{
            handleSave(obj){
                this.support.saveTab(this.tabData,obj)
                this.$emit('change',this.tabData)
            },
            removeTabs(targetName){
                let tabs = this.tabData;
                let activeName = this.activeName;
                if (targetName === activeName) {
                    tabs.forEach((tab, index) => {
                        if (tab.id === targetName) {
                            let nextTab = tabs[index + 1] || tabs[index - 1];
                            if (nextTab) {
                                activeName = nextTab.id;
                            }
                        }
                    });
                }
                this.activeName = activeName
                this.tabData = tabs.filter(tab => tab.id !== targetName)
                this.more = this.tabData.length >= 4
                this.$emit('change',this.tabData)
            },
            addCondition(){
               
            },
            removeCondition(obj){
                
            },
            changeCondition(obj){
               
            },
            transformFields(id,obj){

            },
            handleSearch(type,val){

            },
            fieldChange(){

            },
            removeTab(item){
                var index = this.data.indexOf(item);
                if (index !== -1) {
                    this.data.splice(index, 1)
                    this.more = this.data.length >= 4;
                }
            },
            dropdownClick(item){
                var index = this.data.indexOf(item);
                if (index !== -1) {
                    var d=this.data[index];
                    this.activeName = d.id;
                    this.currentName = d.id;
                    this.changeField(); 
                    this.$refs.scheme.setCurrentName('more');        
                }
            },  
            handleClick(tab, event){     
                console.log(tab.name)
                if(tab.name !== 'add' && tab.name !== 'more'){
                    this.activeName = tab.name;
                    this.currentName = tab.name;  
                }else if(tab.name === 'more'){
                    this.activeName = this.currentName;
                    //更多
                }else{
                    this.activeName = this.currentName;
                    this.addTab();
                }
                this.$refs.scheme.setCurrentName(this.activeName);          
            },
            addTab(){
               this.$refs.addPane.open()
            },
            save(obj){
               
            }, 
            handleSymbolChange(val){

            }
        }
    }
</script>
    
<style lang="less">
.el-tabs__new-tab{
    border:none;
    border-left:1px solid #ccc;
    outline: none;
    border-radius: 0px;
    height: 40px;
    width: 40px;
    margin:0px;
    line-height: 40px;
    text-align: center;
}
.el-tabs--card>.el-tabs__header .el-tabs__nav{
    border-top:none; 
    border-right:none;
}
</style>