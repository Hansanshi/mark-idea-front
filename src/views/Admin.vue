<template>
<div>
  

  <div style="padding-bottom: 10px">
<router-link style="color: black ; text-decoration: none;" to="/">
  <el-button >返回</el-button>
</router-link>
  </div>
  <el-tabs  type="card" tab-position="top" >
    <el-tab-pane  label="🔑 修改密码">
    <el-form  label-width="110px" @keyup.enter.native = "handleChangePassword">
      <el-form-item class="noselect" label="旧密码">
        <el-input v-model = "oldPassword" type="password" style="max-width: 500px; margin-right: 20px" 
          ></el-input>
      </el-form-item>
      <el-form-item class="noselect" label="新密码">
        <el-input v-model = "newPassword" type="password" style="max-width: 500px; margin-right: 20px" 
          ></el-input>
      </el-form-item>
      <el-form-item>
          <el-button type="primary" @click="handleChangePassword()">提交</el-button>
      </el-form-item>
    </el-form>

    </el-tab-pane>

<!--   Remote repository section START--->
    <el-tab-pane label="🔄 远程Git仓库">
        <!-- <el-alert
        style="margin-bottom: 20px"
    title="Steps"
    description="Step1: generate ssh key; Step2: copy the generted ssh key and set; Step3: set the remote repository url"
    type="info">
    <div slot="description"></div>
  </el-alert> -->
    <el-form  label-width="100px">
                  <el-form-item class="noselect"  label="说明">
                                <div >依次完成如下三步，点击开始即可备份至远程仓库</div>

                  </el-form-item>

            <el-form-item class="noselect"  label="第一步">
              点击右边按钮
                    <el-button style="margin-left: 3px" class="noselect" type="primary" @click="handleGenSshKey()">生成ssh密钥</el-button>
                    <div v-if="genSshKey">
                    <p style="margin-top: 0px; margin-bottom: 0px" >生成的ssh公钥</p>
<el-input type="textarea"
:readonly="true"
  autosize
  v-model = "sshkey" style="max-width: 500px; margin-right: 20px ; padding-top: 0; color: grey" 
          ></el-input>
          </div>
            </el-form-item>
                        <el-form-item class="noselect"  label="第二步">
                          将生成的ssh公钥粘贴至远程仓库合适位置
                        </el-form-item>

             
      <el-form-item class="noselect" label="第三步">
        输入Git远程仓库地址，例如 git@github.com:Hansanshi/mark-idea-front.git, 并点击提交保存。（点击开始备份即可开始）
        <br/>
        <el-input v-model = "remoteRepoUrl" style="max-width: 500px; margin-right: 20px" 
          placeholder="e.g. git@github.com:Hansanshi/mark-idea-front.git"></el-input>
                    <el-button type="primary" @click="handleSetRemoteRepo()">提交</el-button>
      </el-form-item>

     <el-form-item>
        <el-button type="primary" @click="handleStartPush()">开始备份至远程Git库</el-button>
            <el-button @click="handleStopPush()">停止</el-button>
     </el-form-item>
    </el-form>
    </el-tab-pane>

    <el-tab-pane label="🗂️ 文件管理"><file-manage></file-manage></el-tab-pane>

       <el-tab-pane label="📑 公开笔记管理"><public-note-manage></public-note-manage></el-tab-pane>
       

  </el-tabs>
</div>
</template>
<script>
import axios from 'axios'
import global from '../global'
import FileManage from '@/components/FileManage'
import PublicNoteManage from '@/components/PublicNoteManage'

export default {
    name: "admin",
    components: {
      FileManage,
      PublicNoteManage
    },
    data() {
      return {
        gitActive: 0,
        genSshKey: false,
        sshkey: "",
        remoteRepoUrl: null,
        oldPassword : null,
        newPassword : null,
        config : {
          headers: {
            token : this.$store.getters.getToken,
            username : this.$store.getters.getUsername
          }
        }
      };
    },
    methods: {
      handleStartPush(){
        let url = global.HOST_URL + "/admin/push";
            axios.post(url, null, this.config).then(res => {
              res = res.data;
              if(res.code === 0){
              this.$notify({
              type: 'success',
              message: '开始备份至远程仓库',
              duration: 1000
            });
              }
            }
          )
      },
      handleStopPush(){
          let url = global.HOST_URL + "/admin/push";
            axios.delete(url, this.config).then(res => {
              res = res.data;
              if(res.code === 0){
              this.$notify({
              type: 'success',
              message: '停止备份',
              duration: 1000
            });
              }
            }
          )
      },
      handleSetRemoteRepo(){
        let param = {
          remoteRepoUrl : this.remoteRepoUrl
        }
        let url = global.HOST_URL + "/admin/remote";
        axios.put(url, param, this.config).then(res => {
          res = res.data;
          if(res.code === 0){
            this.$notify({
                    type: 'success',
                    message: '设置远程仓库成功'
                  });
          }
        })
      },
      handleGenSshKey(){
        this.genSshKey = false;
        let url = global.HOST_URL + "/admin/sshkey";
        axios.post(url, null, this.config).then(res => {
            res = res.data;
            if(res.code !== 0){
              return ;
            }
            this.sshkey = res.data;
            this.genSshKey = true;
        })
      },
      handleChangePassword(){
          let url = global.HOST_URL + "/user/changePass";
          let request = {
            password : this.oldPassword,
            newPassword : this.newPassword
          };
          axios.post(url, request, this.config).then(
            res => {
              res = res.data;
              if(res.code === 0){
                  this.$notify({
                    type: 'success',
                    message: '修改密码成功'
                  });
                  this.newPassword = null,
                  this.oldPassword = null
              }else{
                this.$notify({
                    type: 'warning',
                    message: res.msg
                  });
              }
            }
          )
      }
    },
    mounted () {
      if(!this.config.headers.token){
      this.$notify({
                    type: 'warning',
                    message: '需要登录'
                  });
      setTimeout(()=>{this.$router.push('/login');},700);
      return ;
    }
    let url = global.HOST_URL + "/user/validate";
    axios.post(url, null, this.config).then(
      res => {
        res = res.data;
        if(res.code === 0){
          return ;
        }
        this.$store.commit('setLocalInfo', {});
        this.$notify({
                  type: 'warning',
                  message: '需要登录',
                  duration: 1500
            });
        setTimeout(()=>{this.$router.push('/login');},700);
        
      }
    )
    // TODO user info
    let getRemoteRepoUrl = global.HOST_URL + "/admin/remote";
    axios.get(getRemoteRepoUrl, this.config).then(
      res => {
        res = res.data;
        if(res.code === 0){
          this.remoteRepoUrl = res.data;
        }
      }
    )
    }
  };
</script>
<style>
.el-tabs__item{

    -webkit-touch-callout: none; /* iOS Safari */
    -webkit-user-select: none; /* Chrome/Safari/Opera */
    -khtml-user-select: none; /* Konqueror */
    -moz-user-select: none; /* Firefox */
    -ms-user-select: none; /* Internet Explorer/Edge */
    user-select: none; /* Non-prefixed version, currentlynot supported by any browser */
}
</style>

