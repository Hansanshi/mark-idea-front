<template>
  <div >
        <el-container style="max-width: 1300px; margin:auto">
     <el-header  class="header noselect" @contextmenu.prevent.native >
       <strong @click="showAllArticles = !showAllArticles" > 📕 {{author}} - {{title}}</strong>
         <el-button class="pull-right" style="margin-top: 15px; "  @click="showOutline = !showOutline" size="small">大纲</el-button>
     </el-header>
       <el-container>
         <el-aside v-show="showAllArticles " class="lined" style="width:350px"> 
       <div class="article-list" >📚 公开笔记列表</div>
       <div class="artileItem" v-for="item of articleList" :key="item.articleId" @click="switchToArticle(item.articleId)"> 
         <div class="article-title">📙 {{item.noteTitle}}</div>
       <div class="article-preview">{{item.previewContent}}</div>
       </div>
       <el-pagination
    background
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="pageIndex"
      :page-sizes="[10, 50, 100]"
      :page-size="pageSize"
      layout=" prev, next, jumper, sizes"
      :total="totalSize">
    </el-pagination>
       </el-aside>
       <el-main class="lined">
          <div  id="article" />
     </el-main>
     <el-aside v-show="showOutline " class="lined" > 
       <!-- <div class="outline-title">大纲</div> -->
       <div id="outline" style="display:block"> </div> </el-aside>
     
       </el-container>
            </el-container>

  </div>
</template>
<script>
import '@/assets/vditor.css'
// import Vditor from 'vditor'
import axios from 'axios'
import global from '@/global'
import util from '@/js/util'
import VditorPreview from 'vditor/dist/method.min'

export default {
  name: 'Article',
props : {
        id:String,
        author:String
            },
  data() {
    return {
            pageTitle:this.$store.getters.getWebsiteTitle,
            showAllArticles:false,
      totalSize:0,
      pageSize:10,
      pageIndex:1,
      articleList:[],
      content : "# 未找到",
      title: "",
      showOutline: true
    }
  },
  methods: {
    switchToArticle(articleId) {
      console.log(articleId);
      if(articleId === this.id) {
        return ;
      }
      this.$router.push('/article/' + this.author + '/' + articleId);

        this.loadCurArticle(articleId);

    },
    loadArticles(pageIndex, pageSize) {
        let url = global.HOST_URL + '/article/'+ this.author +'?pageIndex=' + (pageIndex-1) + '&pageSize=' + pageSize;
        axios.get(url).then(res => {
          res = res.data;
          if(res.code === 0) {
            res  = res.data;
              this.articleList = res.content;
              this.totalSize = res.totalElements;
              this.pageIndex = res.number + 1;
                this.pageSize = res.size;
                console.log(this.articleList)
          }
        })

    },
    handleSizeChange(pageSize){          
          this.loadArticles(this.pageIndex, pageSize)
      },
    handleCurrentChange(pageIndex){          
            this.loadArticles(pageIndex, this.pageSize)
    },
    loadCurArticle(articleId){
          var element = document.getElementById("article");

      axios.get(global.HOST_URL+"/article/" + this.author + "/" + articleId).then(res => {
      res = res.data;
      if(res.code === 0 && res.data.content) {
        this.title = res.data.noteTitle;
        document.title = this.$store.getters.getWebsiteTitle + " - " + this.title;
        VditorPreview.preview(element, res.data.content,
        {anchor:1,
        after: () => {
          console.log("outline render")
          console.log(element)
          console.log(document.getElementById("outline"))
      VditorPreview.outlineRender(element, document.getElementById("outline"));

        },
        hljs:{
                style: "native"
            }});
      } else {
                VditorPreview.preview(element, "# 未找到");

      }
    })
    }
  },
  mounted () {
    document.title = this.$store.getters.getWebsiteTitle;
    if(util.isMobile()) {
      this.showOutline = false;
    }
    this.loadArticles(this.pageIndex, this.pageSize);
    this.loadCurArticle(this.id);
  }
  }
</script>
<style>
.header{
  /* margin-top: 10px; */
  color: rgb(24, 21, 17);
  line-height: 60px;
  font-size: 25px;
  border-top-left-radius:5px;
    border-top-right-radius:5px;
          border: 1px solid rgb(240, 237, 237);
background-color: #FAFAFA;

        /* background-color: rgb(252, 250, 250); */

}
.article-title{
  padding-top: 10px;
    font-size: 20px;
    font-weight: 600;
    margin-left: 20px;
    margin-bottom: 10px;
}
.article-preview{
    margin-left: 20px;
    padding-bottom: 20px;
    
}
.artileItem{
  background-color: rgb(253, 252, 249);
}
.article-list{
  padding-left:20px;
      font-size: 20px;
          font-weight: 700;
  padding-top: 8px;
  padding-bottom: 8px;
  background-color: rgb(250, 248, 246);

}
.lined{
  /* height:200px; */
      /* background-color: rgb(252, 250, 250); */
      border: 1px solid rgb(240, 237, 237);

}
.outline-title{
  padding-top: 10px;
  padding-left: 24px;
  font-size: 20px;
  font-weight: 500;
  color: #000;
  
}
ul{
  list-style: none;
}
svg{
  height: 10px;
  width: 10px;
}
</style>