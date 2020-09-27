<template>
<div>
  <input @change="handleFileUpload($event)" style="display : none" ref="fileUpload" type="file" />

    <div>
          <el-button @click="tirggerFileUpload">上传</el-button>
        <el-button @click="handleDeleteSelectedFile">删除</el-button>
    </div>
  <el-table
    ref="multipleTable"
    :data="tableData"
    tooltip-effect="dark"
    style="width: 100%"
    @selection-change="handleSelectionChange">
    <el-table-column
      type="selection"
      width="55">
    </el-table-column>
    <el-table-column
      label="文件名"
      width="300">
      <template slot-scope="scope">{{ scope.row.fileName }}</template>
    </el-table-column>
    <el-table-column
      prop="fileSize"
      label="大小"
      width="120">
    </el-table-column>
    <el-table-column
      prop="lastModifiedTime"
      label="修改时间"
      width="200"
      show-overflow-tooltip>
    </el-table-column>
    <el-table-column
    label = "操作"
    >
          <template slot-scope="scope">

    <a :href = '"/file/" + config.headers.username + "/" + scope.row.fileName ' style="padding-right: 10px" target="_blank">预览</a>
    <el-button type="text" size="medium" @click="handleDeleteFile(scope.row.fileName)">删除</el-button>
    </template>
    </el-table-column>
  </el-table>
    <div class="pagination">
    <el-pagination
    background
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="pageIndex"
      :page-sizes="[10, 50, 100]"
      :page-size="pageSize"
      layout=" prev, pager, next, jumper, sizes, total"
      :total="totalSize">
    </el-pagination>
  </div>
  </div>
</template>

<script>
import global from '@/global'
import axios from 'axios'


  export default {
    data() {
      return {
          config : {
        headers: {
          token : this.$store.getters.getToken,
          username : this.$store.getters.getUsername
        }
      },
        tableData: [{
            fileName: "玉米.md",
            fileSize: "134 GB",
            lastModifiedTime: "2020-09-24 56:78"
        },
        {
            fileName: "yuyu.md",
            fileSize: "132 GB",
            lastModifiedTime: "2020-09-24 56:78"
        }],
        selectedFiles: [],
        pageSize : 10,
        pageIndex : 1,
        totalSize: 0
      }
    },

    methods: {
      tirggerFileUpload(){
          this.$refs.fileUpload.click();
      },
      
      handleSelectionChange(val) {
          console.log(val)
        this.selectedFiles = val;
      },
      handleSizeChange(pageSize){          
          this.loadUserFiles(this.pageIndex, pageSize)
      },
      handleCurrentChange(pageIndex){          
            this.loadUserFiles(pageIndex, this.pageSize)

      },
      loadUserFiles(pageIndex, pageSize){
          
          let url = global.HOST_URL + '/file?pageIndex=' + pageIndex + '&pageSize=' + pageSize;
          axios.get(url, this.config).then(res => {
              res = res.data;
            if(res.code == 0){
                console.log(res.data)
                this.tableData = res.data.fileDetailList;
                this.pageIndex = res.data.pageIndex;
                this.pageSize = res.data.pageSize;
                this.totalSize = res.data.totalSize;
            }
          });
      },
      handleDeleteSelectedFile(){
          var toDelFiles = [];
          for (let i = 0; i < this.selectedFiles.length; i++) {
              let element = this.selectedFiles[i];
              toDelFiles.push(element.fileName);

          }
          this.handleBatchDeleteFile(toDelFiles);
          
      },
      handleDeleteFile(toDelFile){
          var toDelFiles = [];
          toDelFiles.push(toDelFile);
          this.handleBatchDeleteFile(toDelFiles);
      },
      handleBatchDeleteFile(toDelFiles){
          let url = global.HOST_URL + '/file/delete/batch';
          let request = {
              fileNames:toDelFiles
          };
          if(request.fileNames.length == 0){
              return ;
          }
          axios.post(url, request, this.config).then(res => {
              res = res.data;
              if(res.code !== 0){
                  return ;
              }
              this.loadUserFiles(1, this.pageSize);
          });

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
          this.loadUserFiles(this.pageIndex, this.pageSize)
        });
      }
    },
    mounted (){
        this.loadUserFiles(this.pageIndex, this.pageSize)
    }
  }
</script>
<style scoped>
.pagination{
    padding-top: 10px;
}
</style>