<template>
    <el-form :model="loginFormData" :rules="rules" ref="loginFormData" label-position="left" label-width="0px" class="login-box">
        <h3 class="title">系统登录</h3>
        <el-form-item prop="username">
            <el-input type="text" v-model="loginFormData.username" auto-complete="off" placeholder="账号"></el-input>
        </el-form-item>
        <el-form-item prop="password">
            <el-input type="password" v-model="loginFormData.password" auto-complete="off" placeholder="密码"></el-input>
        </el-form-item>
        <el-checkbox v-model="checked" checked class="remember">记住密码</el-checkbox>
        <el-form-item style="width:100%;">
            <el-button type="primary" style="width:100%;" @click.native.prevent="onLoginSubmit" :loading="logining">登录</el-button>
        </el-form-item>
    </el-form>
</template>

<script>
import * as api from '@/utils/api';
import * as lib from '@/utils/lib';

export default {
    data() {
        return {
            logining: false,
            loginFormData: {
                username: '',
                password: ''
            },
            rules: {
                username: [{
                    required: true,
                    message: '请输入账号',
                    trigger: 'blur'
                }],
                password: [{
                    required: true,
                    message: '请输入密码',
                    trigger: 'blur'
                }]
            },
            checked: true
        };
    },
    methods: {
        onLoginSubmit(ev) {
            this.$refs.loginFormData.validate((valid) => {
                if (valid) {
                    this.logining = true;
                    api.postLogin(this.loginFormData).then(res => {
                        this.logining = false;
                        let { msg, status, data } = res;

                        if (status == 200) {
                            lib.logout({'token': data.token, 'sysUserName': data.name});
                        } else {
                            this.$message({
                                message: msg,
                                type: 'error'
                            });
                        }
                    });
                } else {
                    console.log('error submit!!');
                    return false;
                }
            });
        }
    }
}
</script>
<style lang="scss" scoped>
.login-box {
    margin: 180px auto;
    width: 350px;
    padding: 35px 35px 15px;
    background: #fff;
    border: 1px solid #eee;
    box-shadow: 0 0 25px #cac6c6;
    border-radius: 5px;
    .title {
        margin: 0px auto 40px;
        text-align: center;
        color: #505458;
    }
    .remember {
        margin: 0px 0px 35px 0px;
    }
}
</style>
