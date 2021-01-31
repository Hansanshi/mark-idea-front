<template>
  <div> 编辑器设置 

      <el-form ref="form" label-width="140px">



        <el-form-item label="默认编辑模式">
            <el-select v-model="editorConfig.editMode" placeholder="请选择">
              <el-option
      v-for="item in editModeOptions"
      :key="item.value"
      :label="item.label"
      :value="item.value">
    </el-option>
            </el-select>
        </el-form-item>

        <el-form-item label="是否统计字数">
            <el-switch
    v-model="editorConfig.enableCounter"
    :active-color="switchActiveColor"
    :inactive-color="switchInactiveColor"
    :active-value="true"
    :inactive-value="false">
  </el-switch>
        </el-form-item>

        <el-form-item label="是否启用代码高亮">
            <el-switch
    v-model="editorConfig.enableHighLight"
    :active-color="switchActiveColor"
    :inactive-color="switchInactiveColor"
    :active-value="true"
    :inactive-value="false">
  </el-switch>
        </el-form-item>

                    <el-form-item v-if="editorConfig.enableHighLight" label="代码样式">
                          <el-input style = "max-width:100px " clearable v-model="editorConfig.codeStyle" />
                            <el-link style="padding-left: 5px" :underline="false" href="https://xyproto.github.io/splash/docs/longer/all.html" target="_blank">样式参考</el-link>
            </el-form-item>

        <el-form-item label="是否启用代码行号">
            <el-switch
    v-model="editorConfig.enableLineNumber"
    :active-color="switchActiveColor"
    :inactive-color="switchInactiveColor"
    :active-value="true"
    :inactive-value="false">
  </el-switch>
        </el-form-item>


<el-form-item label="大纲位置">
            <el-select v-model="editorConfig.outlinePosition" placeholder="请选择">
              <el-option
      v-for="item in outlinePositionOptions"
      :key="item.value"
      :label="item.label"
      :value="item.value">
    </el-option>
            </el-select>
        </el-form-item>

        <el-form-item label=自定义编辑器样式>
            <el-switch
    v-model="editorConfig.enableCustomStyle"
    :active-color="switchActiveColor"
    :inactive-color="switchInactiveColor"
    :active-value="true"
    :inactive-value="false">
  </el-switch>
        </el-form-item>

<el-form-item v-if="editorConfig.enableCustomStyle" label="编辑器样式路径">
                          <el-input style = "max-width:280px;padding-right:5px "  clearable v-model="editorConfig.customStylePath" />
                                      <el-button type="mini"   @click="tirggerFileUpload">导入</el-button>
  <input @change="handleFileUpload($event)" style="display : none" ref="fileUpload" type="file" />

                          <el-link style="padding-left: 5px" :underline="false" href="https://github.com/Hansanshi/mark-idea-front/blob/main/src/assets/vditor.css" target="_blank">样式参考</el-link>
            </el-form-item>

            <el-form-item>
            <el-button type="primary"  @click="handleSaveEditorConfig">保存</el-button>

            </el-form-item>

      </el-form>

  </div>
</template>

<script>
import axios from 'axios'
import global from '../global'

export default {
  data(){
    return {
      config : {
          headers: {
            token : this.$store.getters.getToken,
            username : this.$store.getters.getUsername
          }
        },
      switchActiveColor: getComputedStyle(document.body).getPropertyValue('--switch-active-color'),
            switchInactiveColor: getComputedStyle(document.body).getPropertyValue('--switch-inactive-color'),
      editModeOptions: [
        {value:"ir", label:"即时渲染"},
        {value:"wysiwyg", label:"所见即所得"},
        {value:"sv", label:"分屏预览"},

      ],
      outlinePositionOptions: [
        {value:"left", label:"左侧"},
        {value:"right", label:"右侧"},
      ],
      editorConfig: {
      }

    }
    
  },
  methods: {
    handleSaveEditorConfig() {
      // if(this.config) {
      //   return ;
      // }
      axios.post(global.HOST_URL + "/user/updateEditorConfig", this.editorConfig, this.config).then(res => {
            res = res.data;
            if(res.code === 0) {
                this.editorConfig = res.data;
                this.$store.commit("setEditorConfig", res.data);
                this.$notify({
                type: 'success',
                message: '更新配置成功',
                duration: 2000
                });
            } else {
            this.$notify({
                type: 'warning',
                message: '更新配置失败',
                duration: 2000
                });
            }
        })
    },
    loadEditorConfig() {
      axios.get(global.HOST_URL + "/user/editorConfig", this.config).then(res => {
            res = res.data;
            if(res.code === 0) {
                this.editorConfig = res.data;
            } else {
            this.$notify({
                type: 'warning',
                message: '加载配置失败',
                duration: 2000
                });
            }
        })
    },
      tirggerFileUpload(){
          this.$refs.fileUpload.click();
      },
    handleFileUpload(){
        let file = event.target.files[0];
        let param = new FormData();
        param.append('file', file);
        let config = {
            headers: { 
              'Content-Type': 'multipart/form-data',
                token : this.config.headers.token,
                username : this.config.headers.username
            }
        };  
        //添加请求头
        let url = global.HOST_URL + "/file";
        axios.post(url, param, config).then(res => {
          res = res.data;
          if(res.code !== 0){
            return ;
          }
          this.editorConfig.customStylePath = res.data;
        });
      }
  }

}
</script>

<style>

</style>