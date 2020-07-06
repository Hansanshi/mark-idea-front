<template>
  <div >
    <el-container>
      <el-header class="header noselect" >  <span @click="showAside = !showAside" style="float:left">
<strong>MarkIdea</strong></span>
<div>
  <span style="padding-right: 0px; text-align: right; display: block;margin-right: 0px;">
<i style="color: black; font-size: 30px; margin-top: 15px" class="fa fa-bars"></i>
</span>
</div>

</el-header>
      <el-container  >
        <!-- 笔记本列表  -->
        <el-aside width="200px" class="notebooklist noselect" v-if="showAside">
        <el-popover 
            placement="bottom">
            <div> 
              <el-input v-model="newNotebookName" @keyup.enter.native="handleCreateNotebook" placeholder="新笔记本名" />
            </div>
        <div slot="reference" class="createNotebook notebook">🆕 新建笔记本</div>
        </el-popover>
        <div class="notebook" v-for="item of notebookList" 
        :key="item.notebookName" @click="selectNoteList(item.notebookName)">
        <!-- <i class="fa fa-file-text-o" style="margin-right: 5px"/> -->
        📙
        <span>{{item.notebookName}}</span>
        </div>
      </el-aside>


        <!-- 笔记列表  -->
       <el-aside class="noselect" width="300px" v-if="showAside">
         <div class="notebookInfo">
           <div>
           <span class="noselect">📔 </span>{{curNotebook.notebookName}}
           </div>
             <el-popover 
            placement="bottom"
            trigger="click">
            <div> 
              <el-input v-model="newNoteTitle" @keyup.enter.native="handleCreateNote" placeholder="新笔记名" />
            </div>
        <span slot="reference" >
          <span @click="test" v-if="curNotebook.notebookName !== null" class="createNote">🆕 新建笔记</span>
          </span>
        </el-popover>
         </div>
        <div class="note" v-for="item of curNotebook.noteList" 
        @click="selectNote(item.title)"
        :key="item.title">
        <!-- <i class="fa fa-file-text" style="margin-right: 5px"/> -->
        <div class="notetitle">
          <span class="noselect">📝 </span>{{item.title}}</div>  
        <div>目前没有摘要，只能如此充数，12344478976985680956890-359</div>  </div>
        
      </el-aside>

      <el-main>
        <Editor class="editor" ref="editor" @saveContent="handleSaveContent"/>
      </el-main>
    

    </el-container>
      </el-container>

      <!-- 右键菜单 -->

<v-contextmenu ref="notebookRightMenu">


</v-contextmenu>


      <!-- -->
  </div>
</template>

<script>
// @ is an alias to /src
// import HelloWorld from '@/components/HelloWorld.vue'
import Editor from '@/components/Editor.vue'
import axios from 'axios'
import global from '@/global'

export default {
  name: 'Home',
  components: {
    // HelloWorld,
    Editor
  },
  data(){
    return {
      config : {
        headers: {
          token : this.$store.getters.getToken,
          username : this.$store.getters.getUsername
        }
      },
      // 新笔记名
      newNotebookName: "",
      newNoteTitle: "",
      curNotebook: {
        notebookName: null,
        noteList:[]
      },
      curNote: {
        noteTitle: "",
        content: ""
      },
      showAside: true,
      notebookList: [],
      noteList: [
        {
          title: '笔记标题1',
          abstract: '假如说我哦拥有过去的一切的一切，那么未来也不过是过去的一切'
        },
         {
          title: '笔记标题4',
          abstract: '曾经有一份真挚的爱情摆在我的面前'
        }

      ]
    }
  },
  methods: {
    test(){
      console.log("dsds")
    },
    refreshNotebookList(){
    axios.get(global.HOST_URL+"/note", this.config).then(res => {
      res = res.data;
      if(res.code === 0){
        this.notebookList = res.data;
        this.doSwitchNotebook(this.curNotebook.notebookName)
      }
    })
    // axios.get(global.HOST_URL+"/delnote", this.config).then( res => {
    //   res = res.data;
    //   if(res.code === 0){
    //     this.delNoteList = res.data;
    //   }
    // } )
  },
  selectNoteList(notebookName){
    // 判断是否是同一个笔记本
    if(this.curNotebook.notebookName === notebookName){
      return ;
    }
    // 判断是否有未保存的内容
    if(this.isModifUnsaved()){
      this.$confirm('修改尚未保存', 'Confirm', {
          distinguishCancelAndClose: true,
          confirmButtonText: '保存',
          cancelButtonText: '丢弃'
        }).then(() => {
          this.handleSaveContent(this.$refs.editor.getContent());
        }).catch(
          action => {
            this.$message({
              type: action === 'cancel' ? 'warning' : 'info',
              message: action === 'cancel'
                ? '丢弃修改'
                : '停留在当前页',
                duration: 1500
            });
            if( action === 'cancel'){
      this.doSwitchNotebook(notebookName);
            }
          }
        )
    }else{
      this.doSwitchNotebook(notebookName);
    }
  },
  // 真的切换笔记本
  doSwitchNotebook(notebookName){

    for (const notebook of this.notebookList) {
          if(notebook.notebookName === notebookName){
            this.curNotebook = notebook;
            return ;
          }
        }

  },
  selectNote(noteTitle){
    // 同一个笔记  不用动
    if(noteTitle == this.curNote.title){
      return ;
    }

    // 

    let url = global.HOST_URL+"/note/"+this.curNotebook.notebookName+"/"+noteTitle;
      axios.get(url, this.config).then(res => {
        res = res.data;
        if(res.code === 0){
          this.curNote.noteTitle = noteTitle;
          this.curNote.content = res.data;
          console.log("select note")
          console.log(res.data)
                    console.log(res.data.length)

      this.$refs.editor.setContent(noteTitle, res.data);
      console.log(this.$refs.editor.getContent())
        }
      })
  },
  // 保存笔记
  handleSaveContent(content){
    console.log("save note:  "+content);
    let request = {
        content: content
    }
    let url = global.HOST_URL + "/note/" + this.curNotebook.notebookName + "/"+ this.curNote.noteTitle;
    console.log(url)
    axios.post(url, request, this.config).then(res => {
      res = res.data;
      if(res.code === 0){
        console.log("保存成功")
        this.refreshNotebookList();
      }else{
        console.log(res)
      }


    })
  },
  // 新建笔记，实际只是设置标题
  handleCreateNote(){
    // todo check一下是否
    // check curNotebook
    // checkNewNoteExists
    this.curNote.noteTitle = this.newNoteTitle;
    this.curNote.content = "";
    this.$refs.editor.setContent(this.newNoteTitle, "");
  },
  // 新建笔记本
  handleCreateNotebook(){
    let url = global.HOST_URL + "/note/" + this.newNotebookName;
    console.log(url);
    axios.put(url, null, this.config).then(res => {
        res = res.data;
        console.log(res);
        if(res.code === 0){
          this.refreshNotebookList();
        }
    })
  },
    // 删除本地存储信息  并切换至登录页面
  clearInfoAndPushToLogin(){
    this.$store.commit('setLocalInfo', {});
    this.$message({
              type: 'warning',
              message: 'Need login',
              duration: 1000
      });
    setTimeout(()=>{this.$router.push('/login');},700);
  },
    validateUser(){
      let url = global.HOST_URL + "/user/validate";
    axios.post(url, null, this.config).then(
      res => {
        res = res.data;
        if(res.code !== 0){
            this.clearInfoAndPushToLogin();
        }else{
            this.doInit();
        }
      }
    )
    },
  isModifUnsaved(){
    if(this.$refs.editor.getContent().charCodeAt() === 10 && this.curNote.content === ""){
        return false;
    }
    return this.curNote.content !== this.$refs.editor.getContent();
  }
  },
  mounted(){
    this.refreshNotebookList();
  }
}
</script>
<style >
.notebook{
  /* margin: 15px; */
  color: rgb(41, 38, 38);
  font-weight: bold;
  font-size: 18px;
  margin-top: 1px;
  margin-left: 10px;
  margin-right: 10px;
  padding: 10px;
  padding-top: 15px;
  padding-bottom: 15px;
  /* background-color: rgb(247, 244, 242); */

  border-bottom:1px solid rgb(240, 237, 237);
}
.createNotebook{
  text-align: center;
  border:1px solid rgb(240, 237, 237);
  border-radius:7px;
  margin-top: 5px;
  padding-top: 10px;
  padding-bottom: 10px;
  background-color: rgb(247, 245, 240);


}
.createNote{
    text-align: left;
    padding: 5px;
    
    font-weight: lighter;
    font-size: 16px;
    background-color: rgb(247, 245, 240);
  border:1px solid rgb(240, 237, 237);


}

.notebookInfo{
  margin-top: 5px;
  /* background-color: rgb(255, 253, 246); */
  padding:10px;
  font-size: 22px;
  font-weight: bold;
}

.notebooklist{
  /* height:200px; */
      background-color: rgb(252, 250, 246);

}
.note{
  /* margin-top: 5px; */

  margin-left: 5px;
  padding: 10px;
  padding-left: 5px;
  padding-right: 5px;
    border-bottom:1px solid rgb(240, 237, 237);

}

.notetitle{
  font-weight: bold;
  margin-bottom: 5px;
}

.header{
  /* margin-top: 10px; */
  color: rgb(24, 21, 17);
  line-height: 60px;
  font-size: 25px;
  border-top-left-radius:5px;
    border-top-right-radius:5px;

        background-color: rgb(252, 250, 246);

}
</style>