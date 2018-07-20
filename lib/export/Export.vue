<template>
    <div id="s-select">
        <el-dialog
                title="导出所有文件"
                :visible.sync="dialogVisible"
                width="23%"
                ref="exportDialog"
                append-to-body
                :close-on-click-modal="false"
                @close="handleClose">
            <div class="showExport">
                <div class="content">
                    <div class="content-title"><h4>请选择需要导出的表头分类</h4></div>
                    <div style="margin-top: 6px"></div>
                    <el-table
                            :data="headOptions"
                            tooltip-effect="dark"
                            style="width: 100%"
                            height="398"
                            @selection-change="handleSelectionChange">
                        <el-table-column
                                type="selection"
                                width="40">
                        </el-table-column>
                        <el-table-column
                                prop="title"
                                label="全选"
                                width="120">
                        </el-table-column>
                    </el-table>
                </div>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="handleClose">取 消</el-button>
                <el-button type="primary" @click="determine">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>
<script>
    export default {
        props: ['headOptions','visible'],
        data() {
            return {
                dialogVisible:false,
                multipleSelection:[]
            };
        },
        watch:{
            visible(newVal,oldCVal){
                this.dialogVisible = newVal
            }
        },
      
        methods: {
            handleClose(){
                this.dialogVisible=false
                this.$emit('update:visible',false);
            },
            handleSelectionChange(val) {
                this.multipleSelection = val;
            },
            determine(){
                this.$emit('save',this.multipleSelection);
            }
        },

    }
</script>

<style lang="less" scoped>
    .el-dialog__header{
        border-bottom: 1px solid #e4eaec;
        .el-dialog__title{
            font-size: 16px;
        }
    }
    .showExport{
        .content{
            border: 1px solid #e4eaec;
            margin-left: 30px;
            padding: 10px 5px 10px 20px;
            height: 430px;
            width: 80%;
            border-radius: 6px;
            .content-title{
                border-bottom: 1px solid #e4eaec;
                padding: 6px 0;
            }
            .el-table td, .el-table th.is-leaf{
                border-bottom: 0px solid #e4eaec !important;
            }
        }
    }
</style>