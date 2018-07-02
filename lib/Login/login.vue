<template>
    <el-form 
        v-bind="$attrs"
        v-on="$listeners"
        :model="loginForm" 
        :rules="loginRules"
        ref="loginForm"
        label-width="0" 
        size="small">
        <el-form-item  prop="loginName">
            <el-input clearable type="text" v-model="loginForm.loginName" placeholder="请输入账号"
                        @keyup.enter.native='submitForm()'></el-input>
        </el-form-item>
        <el-form-item  prop="password">
            <el-input clearable type="password" v-model="loginForm.password"  placeholder="请输入密码"
                        @keyup.enter.native='submitForm()'></el-input>
        </el-form-item>
        <el-form-item prop="verificationCode">
            <el-col :span="16">
                <el-input  clearable type="text" v-model="loginForm.verificationCode" clearable placeholder="图形码" @keyup.enter.native='submitForm()'></el-input>
            </el-col>
            <el-col :span="8">
                <el-tooltip class="item" effect="dark" content="点击刷新" placement="bottom">
                    <img :src='verificationCode' @click="getGraphicCode" alt="图形码" style="width: 100px;height: 33px;"/>
                </el-tooltip>
            </el-col>
        </el-form-item>
        <el-form-item  v-if="remember">
            <el-checkbox v-model="loginForm.remember" style="margin-right: 98%;">记住登录</el-checkbox>
        </el-form-item>
        <div class="login-box" >
            <el-button type="primary" @click='submitForm()' :loading="load.login" style="width: 100%;" >登录</el-button>
        </div>
        <div class="button-box" v-if="forget && register">
            <el-button type="text" v-if="forget" @click="forgetPassword" style="float: left;" class="forget-btn">忘记密码?</el-button>
            <el-button type="text" v-if="register" @click='dialog.register = true' style="float: right;">还没有账号，立即注册！</el-button>
        </div>
    </el-form>    
</template>
<script>

    import ElForm from 'element-ui/lib/form'

    import http from 'ueb-plug/lib/unit/request'

    const reqeusts={reqeustId:'/permission/user/getRequestId',
                    code:'/permission/user/getIdentifyingCode',
                    checkCode:'/permission/user/checkoutCode',
                    login:'/permission/login'}

    export default{
        name:'ueb-login',
        props:{
            ...ElForm.props,
            //验证码 如果传来的是空字符串 则不开启校验
            urls:{
                type:Object,
                required:false,
                default:()=>reqeusts
            },
            //是否带有注册功能
            register:{
                type:Boolean,
                default:true
            },
            //记住我功能
            remember:{
                type:Boolean,
                default:false
            },
            //忘记密码功能
            forget:{
                type:Boolean,
                default:true
            } 
        },
        data(){
            return {
                loginForm:{loginName:'',password:'',verificationCode:'',remember:false,requestId:''},
                loginRules:{
                    loginName:[{required: true, message: '请输入用户名', trigger: 'blur'}],
                    password:[{required: true, message: '请输入密码', trigger: 'blur'}],
                    verificationCode:[{required: true, message: '请输入图像码', trigger: 'blur'}]
                },
                load:{
                    login:false
                },
                dialog:{
                    register:false 
                },
                verificationCode:''
            }
        },
        created(){
            this.getGraphicCode()
        },
        methods:{
            getGraphicCode(){
                let {reqeustId,code,login}=Object.assign({},this.urls,reqeusts)
                http.postAjax(reqeustId).then(response=>{
                    let {body,retCode,retMsg} = response.data;
                    if(retCode == '0000'){
                        this.loginForm.requestId=body
                        http.postAjax(code,{requestId:this.loginForm.requestId}).then(res=>{
                            let {body:d,retCode:rc,retMsg:rm} = res.data;
                            if(rc == '0000'){
                                this.verificationCode = 'data:image/png;base64,'+d
                            }else{
                               this.errorCodeMsg(rm)
                            }
                        }).catch(error => {
                            this.errorCodeMsg('获取验证码失败')
                        })
                    }else{
                        this.errorCodeMsg(retMsg)
                    }
                }).catch(error => {
                    this.errorCodeMsg('获取验证码失败')
                })
            },
            errorCodeMsg(errorMsg){
                this.reqeustId=''
                this.verificationCode=''
                this.$message({
                    message: errorMsg,
                    type: 'error'
                })
            },
            submitForm(){
                //登录
                this.$refs.loginForm.validate(valid=>{
                    if(!valid){
                        return false
                    }
                    let {reqeustId,checkCode,code,login}=Object.assign({},this.urls,reqeusts)
                    this.load.login = true;
                    let params = {requestId: this.loginForm.requestId, verificationCode: this.loginForm.verificationCode}
                    http.postAjax(checkCode,params).then(response=>{
                       let {retCode,retMsg}=response.data
                       if(retCode !=='0000'){
                           this.errorLogMsg('verificationCode',retMsg)
                           return false
                       }
                       let lp={loginName: this.loginForm.loginName, password: this.loginForm.password,requestId: this.loginForm.requestId}
                       http.postAjax(login,lp).then(res=>{ 
                           let {retCode:rc,retMsg:rm}=res.data
                           if(rc!=='0000'){
                               this.errorLogMsg('unknown',retMsg)
                               return false
                           }
                           this.load.login = false
                           //放Vuex 里面
                           this.$store.state.login
                        })
                    })
                })
            },
            errorLogMsg(position,msg){
                this.load.login = false;
            },
            forgetPassword(){

            }
        }
    }
</script>
<style lang="less" scoped>
    .button-box{
        margin-top: 5px;
    }
    .forget-btn{
        font-family: '微软雅黑';
        color:black;
    }
    .forget-btn:hover{
        color:#3a8ee6;
    }
</style>