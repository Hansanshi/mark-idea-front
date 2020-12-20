<template>
<div>
  <!-- <input @change="handleFileUpload($event)" style="display : none" ref="fileUpload" type="file" /> -->

    <div>
        <el-button @click="handleDelArticles">删除</el-button>
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
      label="公开笔记id"
      width="300">
      <template slot-scope="scope">{{ scope.row.articleId }}</template>
    </el-table-column>
    <el-table-column
      prop="notebookName"
      label="笔记本名"
      width="120">
    </el-table-column>
    <el-table-column
      prop="noteTitle"
      label="标题"
      width="200"
      show-overflow-tooltip>
    </el-table-column>
    <el-table-column
    label = "操作"
    >
          <template slot-scope="scope">

    <a :href = '"/#/article/" + config.headers.username + "/" + scope.row.articleId ' style="padding-right: 10px" target="_blank">预览</a>
    <!-- <el-button type="text" size="medium" @click="handleDeleteFile(scope.row.fileName)">删除</el-button> -->
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
        tableData: [
        ],
        selectedArticles: [],
        pageSize : 10,
        pageIndex : 1,
        totalSize: 0
      }
    },

    methods: {
        handleDelArticles () {
            console.log('handleDelArticles');
            let req = {
                articleList: this.selectedArticles
            }
            console.log(req)
            axios.post(global.HOST_URL + "/article/batchDel", req, this.config).then(res => {
                res = res.data;
                console.log(res)
                if(res.code !== 0) {
                    return ;
                }
                this.listUserArticls(1, this.pageSize);
            });
        },
        handleSelectionChange(selected) {
            this.selectedArticles = selected;
        },
        handleSizeChange(pageSize){          
          this.listUserArticls(this.pageIndex, pageSize)
      },
      handleCurrentChange(pageIndex){          
            this.listUserArticls(pageIndex, this.pageSize)

      },
      listUserArticls(pageIdx, pageSize) {
          axios.get(global.HOST_URL + '/article', {
              headers: this.config.headers,
              params:{
                  page : pageIdx - 1,
                  size : pageSize
              }
          }).then(res => {
              res = res.data;
              if(res.code !== 0) {
                  return ;
              }
              res  = res.data;
              this.tableData = res.content;
              this.totalSize = res.totalElements;
              this.pageIndex = res.number + 1;
                this.pageSize = res.size;
          })
      },
      handleDeleteSelectedArticles () {

      }
    },
    mounted (){
        this.listUserArticls(this.pageIndex, this.pageSize)
    }
  }
</script>
<style scoped>
.pagination{
    padding-top: 10px;
}
</style>