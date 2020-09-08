<template>
  <div >
    <el-container>
      <el-header class="header noselect" style="background-color: #FAFAFA; "> <div >
 <span @click="showAside = !showAside" >
<strong>
📕 MarkIdea</strong></span>
  <!-- <span class="fa "></span> -->
  <!-- <span style="padding-right: 0px; text-align: right; display: block;margin-right: 0px;">
    <el-dropdown> -->

<el-dropdown class="fa  pull-right " placement="top-start"> 
   <span class="el-dropdown-link">
    <i style="color: black; font-size: 25px; margin-top: 20px" class="fa fa-bars noselect" >
</i>

  </span>
   <el-dropdown-menu slot="dropdown">
           <router-link style="color: black ; text-decoration: none" to="/admin">

    <el-dropdown-item >
            设置
      </el-dropdown-item>
              </router-link>

    <el-dropdown-item divided @click.native="handleLogout()">注销</el-dropdown-item>
  </el-dropdown-menu>  
  
  </el-dropdown>

  <!-- </span> -->
</div>
</el-header>
      <el-container  >
        <!-- 笔记本列表  -->
        <el-aside width="200px" class="notebooklist noselect" v-if="showAside">
 
        <div class="notebook" style="  padding-bottom: 10px;color:grey">
        <span  style="font-size: 15px">
<strong>笔记本</strong></span>

        <el-popover 
          v-model="newNoteBookVisible"
            placement="bottom">
            <div> 
              <el-input v-model="newNotebookName" @keyup.enter.native="handleCreateNotebook" placeholder="新笔记本名" />
            </div>

        <i title="新建笔记本" slot="reference" style="color: grey;  margin-top: 3px;font-size: 15px;" class="fa fa-plus-square-o pull-right "/>

        </el-popover>
                </div>

         <div class="notebook" v-for="item of notebookList" 
            v-contextmenu:notebookRightMenu
            :key="item.notebookName" 
            @click="selectNoteList(item.notebookName)">        
📙
        <span>{{item.notebookName}}</span>
        </div> 
        <el-collapse accordion>
            <el-collapse-item >
              <template slot="title">
        <div v-contextmenu:delNotesRightMenu  class="notebook" 
        style=" font-size: 15px; padding-bottom: 10px;color:grey;border-bottom:0px">垃圾桶</div>
              </template>
              <div v-contextmenu:delNoteRightMenu class="delnote" v-for="item of delNoteList" :key="item.id">
                
                  {{item.title}}
                </div>
                </el-collapse-item>
                
        </el-collapse>
      </el-aside>


        <!-- 笔记列表  -->
       <el-aside class="noselect noteList" width="300px" v-if="showAside">
         <div class="notebookInfo">
           <div>
           <span class="noselect">
📙 </span>{{curNotebook.notebookName}}
           <el-popover 
           v-model="newNoteVisible"
           v-if="curNotebook.notebookName !== null" 
            placement="bottom"
            trigger="click">
            <div> 
              <el-input v-model="newNoteTitle" @keyup.enter.native="handleCreateNote" placeholder="新笔记名" />
            </div>
          <i title="新建笔记" slot="reference" style="color: grey;  margin-top: 8px;font-size: 15px;" class="fa fa-plus-square-o pull-right"></i>
        </el-popover>
           </div>
             
         </div>
        <div class="note" 
                v-contextmenu:noteRightMenu

        v-for="item of curNotebook.noteList" 
        @click="selectNote(item.title)"
        :key="item.title">
        <!-- <i class="fa fa-file-text" style="margin-right: 5px"/> -->
        <div class="notetitle">
          <span class="noselect">📝 </span>{{item.title}}</div>  
        <div>{{item.previewContent}}</div>  </div>
        
      </el-aside>

      <el-main class="editor" >
        <Editor  ref="editor" 
        @showHistory="handleShowHistory"
        @saveContent="handleSaveContent" @renameTitle="doHandleRenameTitle" />
      </el-main>
    
<el-aside width="180px" v-if="showHistory">
  <div style="padding-left: 10px;padding-top: 15px;">
  <div style="font-size:18px;padding-bottom: 5px; border"><span style="font-size:20px">🎛️ </span><strong>历史版本</strong></div>
               <div v-for="version of curNoteVersion" :key="version.ref" >
                <span style="font-size:13px;margin-right:3px">{{version.date}}</span>
                    <el-button size="mini" type="text" style="font-size:13px"
                    @click="handleRecover(version.ref)"
                      >恢复</el-button>
              </div>
  </div>
</el-aside>
    </el-container>
      </el-container>

      <!-- 笔记右键菜单 -->

<v-contextmenu theme="dark" class="rightMenu" ref="noteRightMenu" @contextmenu="handleNoteRightMenu">
<v-contextmenu-item v-if="showRenameOption" @click="handleRenameNote">重命名</v-contextmenu-item>
<v-contextmenu-item @click="handleDelNote">删除</v-contextmenu-item>
<v-contextmenu-submenu title="移动至">
    <div v-for="otherNotebook of notebookList" :key="otherNotebook.notebookName">
    <v-contextmenu-item @click="handleMoveNote(otherNotebook.notebookName)" v-if="curNotebook.notebookName !== otherNotebook.notebookName">
      📙  {{otherNotebook.notebookName}}
    </v-contextmenu-item>
    </div>
  </v-contextmenu-submenu>
<v-contextmenu-submenu title="复制到">
    <div v-for="otherNotebook of notebookList" :key="otherNotebook.notebookName">
    <v-contextmenu-item @click="handleCopyNote(otherNotebook.notebookName)" v-if="curNotebook.notebookName !== otherNotebook.notebookName">
      📙  {{otherNotebook.notebookName}}
    </v-contextmenu-item>
    </div>
  </v-contextmenu-submenu>

</v-contextmenu>


      <!-- 笔记本右键菜单 -->
      <v-contextmenu theme="dark" class="rightMenu" ref="notebookRightMenu" @contextmenu="handleNotebookRightMenu">
        <v-contextmenu-item @click="handleDelNotebook">删除</v-contextmenu-item>

      </v-contextmenu>
        <!-- 垃圾桶右键菜单  -->
        <v-contextmenu theme="dark" class="rightMenu" ref="delNotesRightMenu" >
        <v-contextmenu-item @click="clearAllDelNotes">清空</v-contextmenu-item>

      </v-contextmenu>

      <!-- 删除笔记右键菜单  -->
        <v-contextmenu theme="dark" class="rightMenu" @contextmenu="handleDelNoteRightMenu" ref="delNoteRightMenu" >
        <v-contextmenu-item @click="clearDelNote">删除</v-contextmenu-item>
        <v-contextmenu-item @click="recoverDelNote">恢复</v-contextmenu-item>

      </v-contextmenu>

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
      // 是否展示重命名选项
      showRenameOption: false,
      // 被删除笔记列表
      delNoteList:[],
      // 用于存放右键菜单选中的笔记信息
      noteRightMenuValues:{},
      // 新建笔记本弹窗
      newNoteBookVisible:false,
      // 新建笔记按钮弹窗
      newNoteVisible:false,
      // 新笔记名
      newNotebookName: "",
      showHistory: false,
      newNoteTitle: "",
      curNotebook: {
        notebookName: null,
        noteList:[]
      },
      curNote: {
        noteTitle: null,
        content: ""      },
      curNoteVersion: [],
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
    
    refreshNotebookList(notebookName){
    axios.get(global.HOST_URL+"/note", this.config).then(res => {
      res = res.data;
      if(res.code === 0){
        this.notebookList = res.data;
        if(notebookName){
                  this.doSwitchNotebook(notebookName);
                  return ;

        }
        this.doSwitchNotebook(this.curNotebook.notebookName)
      }
    })
    axios.get(global.HOST_URL+"/delnote", this.config).then( res => {
      res = res.data;
      if(res.code === 0){
        this.delNoteList = res.data;
      }
    } )
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

          this.handleSaveContentAndSwitchNotebook(this.$refs.editor.getContent(), notebookName);
        }).catch(
          action => {
            this.$notify({
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
            if(notebook.noteList && notebook.noteList.length > 0){
              this.selectNote(notebook.noteList[0].title);
            }else{
              this.clearCurNoteInfo();
            }
            return ;
          }
        }
  },
  clearCurNoteInfo(){
    this.curNote = {
      content: ""
    };
          this.$refs.editor.setContent(null, "", null);

  },
  clearCurNotebookInfo(){
    this.curNotebook = {};
  },
  selectNote(noteTitle){
    // 同一个笔记  不用动
    if(noteTitle == this.curNote.title){
      return ;
    }

    // 判断是否有未保存的内容
    if(this.isModifUnsaved()){
      this.$confirm('修改尚未保存', 'Confirm', {
          distinguishCancelAndClose: true,
          confirmButtonText: '保存',
          cancelButtonText: '丢弃'
        }).then(() => {

          this.saveContentAndSwitchNote(this.$refs.editor.getContent(), this.curNotebook.notebookName, noteTitle);
        }).catch(
          action => {
            this.$notify({
              type: action === 'cancel' ? 'warning' : 'info',
              message: action === 'cancel'
                ? '丢弃修改'
                : '停留在当前页',
                duration: 1500
            });
            if( action === 'cancel'){
      this.doSwitchNote(noteTitle, this.curNotebook.notebookName);
            }
          }
        )
    }else{
      this.doSwitchNote(noteTitle, this.curNotebook.notebookName);

    }
  },
  doSwitchNote(noteTitle, notebookName){
    let url = global.HOST_URL+"/note/"+notebookName+"/"+noteTitle;
      axios.get(url, this.config).then(res => {
        res = res.data;
        if(res.code === 0){
          this.showHistory = false;
          this.curNote.noteTitle = noteTitle;
          this.curNote.content = res.data;
    this.curNoteVersion = [];

      this.$refs.editor.setContent(noteTitle, res.data, notebookName);
        }
      })

  },
  handleSaveContentAndSwitchNotebook(content, notebookName){
    let request = {
        content: content
    }
    let url = global.HOST_URL + "/note/" + this.curNotebook.notebookName + "/"+ this.curNote.noteTitle;
    axios.post(url, request, this.config).then(res => {
      res = res.data;
      if(res.code === 0){
        this.curNote.content = content;
        this.refreshNotebookList(notebookName);
      }else{
        console.log(res)
      }


    })
  },
  saveContentAndSwitchNote(content, targetNotebookName, targetNoteTitle){
    let request = {
        content: content
    }
    let url = global.HOST_URL + "/note/" + this.curNotebook.notebookName + "/"+ this.curNote.noteTitle;
    axios.post(url, request, this.config).then(res => {
      res = res.data;
      if(res.code === 0){
        this.doSwitchNote(targetNoteTitle, targetNotebookName);
      }else{
        console.log(res)
      }

    })
  },
  // 清空删除笔记
  clearAllDelNotes(){
    let url = global.HOST_URL + "/delnote";
      axios.delete(url, this.config).then(
        res => {
          res = res.data;
          if(res.code === 0){
            this.delNoteList = [];
          }
        }
      )
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
        this.curNote.content = content;
        this.refreshNotebookList();
      }else{
        console.log(res)
      }


    })
  },
  handleShowHistory(){
    console.log("handleShowHistory")
    this.showHistory = !this.showHistory;
    let url = global.HOST_URL+ "/note/" + this.curNotebook.notebookName  + "/" + this.curNote.noteTitle + "/history";
    axios.get(url, this.config).then(res => {
      res = res.data;
      if(res.code === 0){
        console.log(res.data)
        this.curNoteVersion = res.data;
      }
    })
  },
  // 注销登录
  handleLogout(){
      let url = global.HOST_URL + "/user/logout";
      axios.post(url, null, this.config);
      this.$store.commit('setLocalInfo', {});
      setTimeout(()=>{this.$router.push('/login');},500);
    },
  // 新建笔记，实际只是设置标题
  handleCreateNote(){
    // todo check一下是否
    // check curNotebook
    // checkNewNoteExists
    this.showHistory = false;
    this.curNote.noteTitle = this.newNoteTitle;
    this.newNoteTitle = undefined;
    this.curNote.content = "";
    this.$refs.editor.setContent(this.curNote.noteTitle, "", this.curNotebook.notebookName);
    this.newNoteVisible = false;
  },
  // 新建笔记本
  handleCreateNotebook(){
    let url = global.HOST_URL + "/note/" + this.newNotebookName;
    console.log(url);
    axios.put(url, null, this.config).then(res => {
        res = res.data;
        console.log(res);
        if(res.code === 0){
          this.newNoteBookVisible = false;
          this.refreshNotebookList(this.newNotebookName);
          this.newNotebookName = null;

        }
    })
  },
    // 删除本地存储信息  并切换至登录页面
  clearInfoAndPushToLogin(){
    this.$store.commit('setLocalInfo', {});
    this.$notify({
              type: 'warning',
              message: '需登录',
              duration: 1000
      });
    setTimeout(()=>{this.$router.push('/login');},700);
  },
 
  // 校验用户
    validateUser(){
    if(!this.config.headers.token){
      this.clearInfoAndPushToLogin();
      return ;
    }
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
    // 设置右键选中时笔记信息
    handleNoteRightMenu(vnode){
      console.log('ddddjojo')
      this.noteRightMenuValues.noteTitle = vnode.data.key;
      this.noteRightMenuValues.notebookName = this.curNotebook.notebookName;
            this.showRenameOption = this.isCurNote()

    },
    handleNotebookRightMenu(vnode){
      this.notebookRightMenuValues = {
          notebookName: vnode.data.key
      }
    },
    handleDelNoteRightMenu(vnode){
      console.log(vnode)
      this.delNoteRightMenuValues = {
        delNoteId: vnode.data.key
      }
    },
    clearDelNote(){
      let delNoteId = this.delNoteRightMenuValues.delNoteId;
      let url = global.HOST_URL + "/delnote/" + delNoteId;

      axios.delete(url, this.config).then(
        res => {
          res = res.data;
          if(res.code !== 0){
            return ;
          }
          axios.get(global.HOST_URL+"/delnote", this.config).then( res => {
      res = res.data;
      if(res.code === 0){
        this.delNoteList = res.data;
      }
    } )
        }
      )
    },
    recoverDelNote(){
      let delNoteId = this.delNoteRightMenuValues.delNoteId;
      let url = global.HOST_URL + "/delnote/" + delNoteId + "?recover=true";

      axios.delete(url, this.config).then(
        res => {
          res = res.data;
          if(res.code !== 0){
            return ;
          }
          this.refreshNotebookList();
        }
      )
    },
    handleDelNotebook(){
      let url = global.HOST_URL+"/note/"+this.notebookRightMenuValues.notebookName;
      axios.delete(url, this.config).then(res => {
        res = res.data;
        if(res.code === 0){
          this.clearCurNotebookInfo();
          this.clearCurNoteInfo();
          this.refreshNotebookList();
        }
      })
    },
    isCurNote(){
      console.log('right' );
      console.log(this.noteRightMenuValues)
      if(this.noteRightMenuValues.notebookName !== this.curNotebook.notebookName){
        return false;
      }
      return this.noteRightMenuValues.noteTitle === this.curNote.noteTitle;
    },
    handleDelNote(){
      console.log(this.noteRightMenuValues)
      let url = global.HOST_URL + "/note/" + this.noteRightMenuValues.notebookName + "/" + this.noteRightMenuValues.noteTitle ;
      axios.delete(url, this.config).then( res => {
      res = res.data;
      if(res.code === 0){
        this.refreshNotebookList(this.noteRightMenuValues.notebookName);
        // if(this.rightChosenNote.notebookName == this.chosenNote.notebookName 
        // && this.rightChosenNote.title == this.chosenNote.title){
        //   this.resetChosenNoteAndOriginNote();
        // }
      }
    })

    },
    handleRenameNote(){
      
    this.$refs.editor.setTitleEditable(true);
    },
    doHandleRenameTitle(newTitle){
      console.log('new ' + newTitle);
      console.log('origin ' + this.curNote.noteTitle)
      let targetNotebook = this.curNotebook.notebookName;
      let url = global.HOST_URL + "/note/" + targetNotebook + "/" + newTitle;
      let param = {
        srcNotebook : targetNotebook,
        srcTitle : this.curNote.noteTitle,
        move : true
      }
      axios.put(url, param, this.config).then(res => {
        res = res.data;
        if(res.code === 0){
          this.refreshNotebookList(this.curNotebook.notebookName);
        }else{
          this.$notify({
              type: 'warning',
              message: res.msg
            });
        }
      })

    },
    handleMoveNote(newNotebookName){
      
      let targetNotebook = newNotebookName;
      let url = global.HOST_URL + "/note/" + targetNotebook + "/" + this.curNote.noteTitle;
      let param = {
        srcNotebook : this.curNotebook.notebookName,
        srcTitle : this.curNote.noteTitle,
        move : true
      }
      axios.put(url, param, this.config).then(res => {
        res = res.data;
        if(res.code === 0){
          this.refreshNotebookList(this.curNotebook.notebookName);
        }else{
          this.$notify({
              type: 'warning',
              message: res.msg
            });
        }
      })
    },
    handleCopyNote(newNotebookName){
      let targetNotebook = newNotebookName;
      let url = global.HOST_URL + "/note/" + targetNotebook + "/" + this.curNote.noteTitle;
      let param = {
        srcNotebook : this.curNotebook.notebookName,
        srcTitle : this.curNote.noteTitle,
      }
      axios.put(url, param, this.config).then(res => {
        res = res.data;
        if(res.code === 0){
          this.refreshNotebookList(this.curNotebook.notebookName);
        }else{
          this.$notify({
              type: 'warning',
              message: res.msg
            });
        }
      })
    },
    // 恢复笔记至某一版本
  handleRecover(ref){
    let notebookName = this.curNotebook.notebookName;
    let noteTitle = this.curNote.noteTitle;
    let url = global.HOST_URL + "/note/" + notebookName + "/" + noteTitle;
    let request = {
      versionRef : ref
    };
    
    axios.post(url, request, this.config).then(res => {
      res = res.data;
      if(res.code === 0){
        if(noteTitle !== this.curNote.noteTitle){
          return ;
        }
        this.curNote.content = res.data;
        this.$refs.editor.setContent(noteTitle, res.data, notebookName);
        // 展示新历史
        this.handleShowHistory();
      }
    })
  },
    doInit(){
        this.refreshNotebookList();
        // this.checkUnsavedNote();
        // // todo 将时间改为5min，与后台保持一致
        // this.timer = setInterval(() => {
        //   this.checkPushStatus();
        //   this.autoSaveDraftNote();
        // }, 1 * 60 * 1000);
},
  isModifUnsaved(){
    console.log("compare modify")
    console.log(this.curNote)
    console.log(this.curNotebook)
    console.log(this.$refs.editor.getContent().charCodeAt()  )
    console.log(this.curNote.content)
    if(this.$refs.editor.getContent().charCodeAt() === 10 && this.curNote.content === ""){
        return false;
    }
    console.log(this.$refs.editor.getContent())
    return this.curNote.content !== this.$refs.editor.getContent();
  }
  },
  mounted(){
    this.validateUser();
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
      /* background-color: rgb(252, 250, 250); */
      border: 1px solid rgb(240, 237, 237);

}
.note{
  /* margin-top: 5px; */

  margin-left: 5px;
  margin-right: 5px;
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
          border: 1px solid rgb(240, 237, 237);


        /* background-color: rgb(252, 250, 250); */

}
.editor{
        border: 1px solid rgb(240, 237, 237);

}
.noteList{
          border: 1px solid rgb(240, 237, 237);

}
.rightMenu{
  min-width: 100px;
}
.delnote{
  margin: 5px 15px 5px 15px;
  padding: 1px 1px 1px 5px;
  color: gray;
  font-size: 15px;
  border-bottom:1px solid rgb(240, 237, 237);
  /* border-top:1px solid rgb(240, 237, 237); */

}
.lightGreyBackground{
  background-color: lightgray;
}
</style>