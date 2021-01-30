<template>
  <div >
        <el-container style="max-width: 1300px; margin:auto">
     <el-header  class="header noselect" @contextmenu.prevent.native >
       <strong @click="showOutline = !showOutline"> 📕 {{author}} - {{title}}</strong>
     </el-header>
       <el-container>
     <el-aside v-show="showOutline " class="lined" > 
       <div class="outline-title">大纲</div>
       <div id="outline"> </div> </el-aside>
     <el-main class="lined">
          <div  id="article" />
     </el-main>
       </el-container>
            </el-container>

  </div>
</template>
<script>
import '@/assets/vditor.css'
import Vditor from 'vditor'
import axios from 'axios'
import global from '@/global'
import util from '@/js/util'

export default {
  name: 'Article',
props : {
        id:String,
        author:String
            },
  data() {
    return {
            pageTitle:this.$store.getters.getWebsiteTitle,

      content : "# 未找到",
      title: "",
      showOutline: true
    }
  },
  methods: {
  },
  mounted () {
    document.title = this.$store.getters.getWebsiteTitle;
    var element = document.getElementById("article");
    if(util.isMobile()) {
      this.showOutline = false;
    }
    axios.get(global.HOST_URL+"/article/" + this.author + "/" + this.id).then(res => {
      res = res.data;
      if(res.code === 0 && res.data.content) {
        this.title = res.data.noteTitle;
        document.title = this.$store.getters.getWebsiteTitle + " - " + this.title;
        Vditor.preview(element, res.data.content,
        {anchor:1,
        after: () => {
      Vditor.outlineRender(element, document.getElementById("outline"));

        },
        hljs:{
                style: "native"
            }});
      } else {
                Vditor.preview(element, "# 未找到");

      }
    })
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