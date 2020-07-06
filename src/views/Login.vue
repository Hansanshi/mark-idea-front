<template>
  <div  style="margin-top: 40px; ">
    <el-card class="box-card"  >
        <div align="center" class="box-img">
              <img src="../../public/logo.png" style="width: 260px" >
        </div>
        <el-form  :model="formData"  @keyup.enter.native = "handleLogin">
        
        <el-form-item  prop="username" :rules="formRules.username">
        <el-input maxlength="10" class="box-input"  v-model="formData.username"  placeholder="username" />  
        </el-form-item>
        <el-form-item prop="password" :rules="formRules.password">
        <el-input class="box-input" type="password" v-model="formData.password"  placeholder="password" /> 
        </el-form-item>
        <div class="box-btn">
          <el-button @click="handleLogin" type="primary">login</el-button>
            <el-button @click="handleRegister">register</el-button>
        </div>
        </el-form>
</el-card>
  </div>
</template>
<script>
  import axios from 'axios'
  import global from '../global'

export default {
    name: "login",
    data() {
        return {
            formData: {
                username : null,
            password : null
            },
            formRules:{
                username: [
                    {required:true, message:"Username can't be null" },
                    {pattern:/^[A-Za-z0-9]+$/,message:'Invalid username'}
                ],
                password: [
                    {required:true, message:"Password can't be null" },
                    {pattern:/^[A-Za-z0-9!@#$^]+$/,message:'Invalid password'}
                ]
            }
        }
    },
    methods: {
        handleLogin(){
            let user = {
                username: this.formData.username,
                password: this.formData.password
            }
            
            axios.post(global.HOST_URL+"/user/login",user).then(
                res => {
                    res = res.data;
                    if(res.code === 0){
                         this.$message({
                            type: 'success',
                            message: 'Login successfully',
                            duration: 1000
                            });
                        setTimeout(()=>{this.$router.push('/');},700);
                        this.$store.commit('setLocalInfo', res.data);
                    }else{
                        this.$message({
                            type: 'warning',
                            message: 'Invalid username or password',
                            duration: 2000
                            });
                    }
                }
            );
        },

        handleRegister(){
            let user = {
                username: this.formData.username,
                password: this.formData.password
            };
            let url = global.HOST_URL+"/user";
            axios.post(url,user).then(
                res => {
                    res = res.data;
                    if(res.code === 0){
                         this.$message({
                            type: 'success',
                            message: 'Register successfully'
                            });
                    }else{
                        this.$message({
                            type: 'warning',
                            message: res.msg
                            });
                    }
                }
            );

        }
    }
}
</script>
<style> 

.box-btn{
    float: right;
    margin-bottom: 10px;
    margin-top: 10px;
}


.box-card {
    max-width: 380px;
    margin: 0 auto;
}

.box-img{
    margin: 0 auto;
    /* max-height: 400px; */
    width: 260px;
}
</style>