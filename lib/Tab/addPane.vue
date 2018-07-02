<template>
<el-dialog
    title="添加方案"
    :visible.sync="visible"
    append-to-body
    @close="cancel"
    width="40%">
    <el-form ref="conditionForm"
        :model="search"
        v-bind="$attrs"
        v-on="$listeners"
        size="small"
        style="height: 300px;overflow:auto;">
        <el-form-item>
            <el-col :span="22">
                <el-input v-model="search.name" placeholder="输入方案名称"></el-input>
            </el-col>
        </el-form-item>
        <custom-condition 
            ref="customCondition"
            :data="formData"
            :support="support"
            :is-remove="true" 
            value-style="width:300px;" 
            @change-field="fieldChange">
        </custom-condition> 
    </el-form>
    <el-button type="text" @click="add" size="mini" icon="el-icon-plus" >添加条件</el-button>
    <span slot="footer" class="dialog-footer">
        <el-button @click="cancel">取 消</el-button>
        <el-button type="primary" @click="save">确 定</el-button>
    </span>
</el-dialog>
</template>
<script>
    import Support from './support.js'

    import customCondition from './customCondition'

    export default{
        name:'addPane',
        components:{customCondition},
        props:{
            support:{
                required:true,
                type:Support
            }
        },
        data(){
            return {
              visible:false,
              search:{name:''},
              formData:[]
            }
        },
        watch:{
            visible(newVal,oldVal){
                
            }
        },  
        methods:{
            fieldChange(obj){

            },
            add(){
               this.$refs.customCondition.add()
            },
            open(){
               if(!this.support._isEmpty(this.$refs.customCondition)){
                    this.$refs.customCondition.add()
               } 
              //打开
              this.visible = true;
            },
            cancel(){
              //取消
              this.visible = false;
              if(!this.support._isEmpty(this.$refs.customCondition)){
                this.$refs.customCondition.clear()
              }  
            },
            save(){
                //保存 
                if(!this.support._isEmpty(this.$refs.customCondition)){
                    let data = this.$refs.customCondition.getData()
                    let obj={df:false,searchs:data}
                    this.$emit('save',Object.assign(obj,this.search));
                    this.$refs.customCondition.clear()
                    this.visible = false;
                } 
            }
        }
    }
</script>