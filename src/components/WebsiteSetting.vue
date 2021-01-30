<template>
  <div>
      <el-form ref="form" :model="websiteConfig" :rules="formRules" label-width="140px">
                      <el-form-item label="网站标题">
                          <el-input style = "max-width:200px " clearable v-model="websiteConfig.websiteTitle"></el-input>
                      </el-form-item>

            <el-form-item label="是否允许注册">
                 <el-switch
    v-model="websiteConfig.registerStrategy"
    :active-color="switchActiveColor"
    :inactive-color="switchInactiveColor"
    :active-value="1"
    :inactive-value="0">
  </el-switch>
            </el-form-item>

            <el-form-item :rule="formRules.maxUploadFileSize" prop="maxUploadFileSize" label="最大上传文件大小">
                          <el-input style = "max-width:200px " clearable v-model="websiteConfig.maxUploadFileSize"></el-input>
                          <el-tooltip effect="light" content="需重启服务生效" placement="right">
                          <i style="padding-left:5px;color:grey" class="fa fa-lg fa-info-circle"/>
                          </el-tooltip>
            </el-form-item>

            <el-form-item :rule="formRules.tokenExpireTimeInHour" prop="tokenExpireTimeInHour" label="登录有效时间">
                <el-input style = "max-width:100px " clearable v-model="websiteConfig.tokenExpireTimeInHour" /><span style="padding-left:5px">小时</span>
            </el-form-item>

            <el-form-item>
            <el-button type="primary"  @click="handleSaveWebsiteConfig">保存</el-button>

            </el-form-item>

      </el-form>


  </div>
</template>

<script>
import axios from 'axios'
import global from '../global'

export default {

data() {
    return {
        formRules:{
                tokenExpireTimeInHour: [
                    {required:true, message:"不能为空" },
                    {pattern:/^[0-9]+$/,message:'参数非法'}
                ],
                maxUploadFileSize: [
                    {required:true, message:"不能为空" },
                    {pattern:/^[A-Za-z0-9!@#$^]+MB$/,message:'参数非法，示例：10MB'}
                ]
            },
        config : {
          headers: {
            token : this.$store.getters.getToken,
            username : this.$store.getters.getUsername
          }
        },
            switchActiveColor: getComputedStyle(document.body).getPropertyValue('--switch-active-color'),
            switchInactiveColor: getComputedStyle(document.body).getPropertyValue('--switch-inactive-color'),
            websiteConfig:{
            }
    }
},
methods : 
{
    handleSaveWebsiteConfig () {
        console.log(this.websiteConfig)
        axios.post(global.HOST_URL + "/admin/updateWebsiteConfig", this.websiteConfig, this.config).then(res => {
            res = res.data;
                    // console.log(res)

            if(res.code === 0) {
                // this.websiteConfig = res.data;
                this.$notify({
                type: 'success',
                message: '保存成功',
                duration: 1000
                });
            } else {
                this.$notify({
                type: 'error',
                message: '保存失败',
                duration: 2000
                });
            }
            }
        );
    
}
},
    mounted() {
        axios.get(global.HOST_URL + "/admin/websiteConfig", this.config).then(res => {
            res = res.data;
                        console.log(res)

            if(res.code === 0) {
                this.websiteConfig = res.data;
            } else {
            this.$notify({
                type: 'warning',
                message: '加载配置失败',
                duration: 2000
                });
            }
        })
    }
}
</script>

<style>

</style>