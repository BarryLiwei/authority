<template>
    <span>
        <el-form-item v-for="(condition,index) in formData"
            v-if="max < 1 || index < max" 
            :key="'formItem'+index" 
            :style="fieldStyle">
            <el-col :span="6">
                <el-select placeholder="请选择" v-model="condition.field" @change="hc">
                    <el-option
                        v-for="(pf,fi) in condition.fields"
                        :key="'fields'+fi"
                        :label="pf.name"
                        value-key="id"
                        :disabled="pf.disabled"
                        :value="pf.id">
                    </el-option>
                </el-select>
            </el-col>
            <el-col :span="6">
                <el-select placeholder="请选择"  v-model="condition.condition">
                    <el-option
                        v-for="(sym,si) in condition.symbols"
                        :key="'symbols'+si"
                        :label="sym.name"
                        value-key="id"
                        :value="sym.id">
                    </el-option>
                </el-select>
            </el-col>
            <el-col :span="isRemove===true?10:12">
                <el-input :style="valueStyle" v-model="condition.value" :key="'text_'+index" placeholder="输入值" v-if="condition.type === 'text'"></el-input>
                <el-select :style="valueStyle" placeholder="请选择" :key="'selected1_'+index" v-model="condition.value" :filterable="condition.search" v-else-if="condition.type === 'selected'">
                    <el-option
                        v-for="(o,oi) in condition.options"
                        :key="'selected'+oi"
                        :label="o.label"
                        value-key="value"
                        :value="o.value">
                    </el-option>
                </el-select>
                <el-input :style="valueStyle" v-model="condition.value" :key="'number_'+index" placeholder="输入值" v-else-if = "condition.type === 'number'"></el-input>
                <el-date-picker :style="valueStyle"  v-else-if = "condition.type === 'date' && condition.condition !== 'BETWEEN'"
                    :key="'date_'+index"
                    v-model="condition.value"
                    type="date"
                    placeholder="选择日期"
                    :format="condition.format">
                </el-date-picker>
                <el-date-picker 
                    :style="valueStyle"
                    v-else-if = "condition.type === 'date' && condition.condition === 'BETWEEN'"
                    :key="'daterange'+index"
                    v-model="condition.value"
                    type="daterange"
                    range-separator="至"
                    :format="condition.format"
                    :picker-options="pickerOptions"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期">
                </el-date-picker>
            </el-col>
            <el-col v-if="isRemove && formData.length > 1" :span="2">
                <el-button type="text" @click="clear(condition)"><i class="el-icon-error el-icon--right"></i></el-button>
            </el-col>    
        </el-form-item>
    </span>
</template>
<script>
    import Support from './support.js'
    export default{
        name:'customCondition',
        props:{
            data:{
                required:true,
                type:Array
            },
            isRemove:{
                type:Boolean,
                default:()=>true
            },
            valueStyle:{
                type:String
            },
            fieldStyle:String,
            support:{
                type:Support,
                default:()=>{return new Support([],[],'')}
            },
            max:{
                type:Number,
                default:-1
            }
        },
        data(){
            return {
                pickerOptions:{shortcuts: [{ text: '最近一周',onClick(picker) {const end = new Date();const start = new Date();start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);picker.$emit('pick', [start, end]);}}, {text: '最近一个月', onClick(picker) {const end = new Date();const start = new Date();start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);picker.$emit('pick', [start, end]);}}, {text: '最近三个月',onClick(picker) {const end = new Date();const start = new Date();start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);picker.$emit('pick', [start, end]);}}]},
                formData:this.data
            }
        },
        created(){
            if(this.formData.length<1){
                //如果没有给初始值 则设置一条初始值
                this.formData = this.support.addCondition()
            }
        },
        watch:{
            formData:{
                deep:true,
                handler(curVal,oldVal){
                    this.$emit('change-field',curVal)
                }
            }
        },
        methods:{
            hc(val){
                this.formData = this.support.fieldChange(this.formData)
            },
            add(){
                //添加一条
                this.formData = this.support.addCondition(this.formData)
            },
            clear(obj){
                this.formData = this.support.removeCondition(this.formData,obj)
            },
            getData(){
                return this.formData
            }
        }
    }
</script>