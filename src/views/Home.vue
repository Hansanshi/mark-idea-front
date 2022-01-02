<template>
  <div >
    <el-container>
      <el-header class="header noselect" style="background-color: rgb(248, 248, 248); " @contextmenu.prevent.native> 
        <div >
 <span  @click="showAside = !showAside" >
 <span>📕</span>
<strong >
 {{pageTitle}}</strong></span>
<span style="color: rgb(248, 248, 248); font-size: 25px; margin-top: 20px;" class="fa fa-bars"></span>

  <!-- <span style="padding-right: 0px; text-align: right; display: block;margin-right: 0px;">
    <el-dropdown> -->
<!-- <span style="padding-right: 0px; text-align: right; margin-right: 0px;"> -->
<el-dropdown class="pull-right" placement="top-start"> 
   <span class="el-dropdown-link">
    <i style="color: black; font-size: 25px; margin-top: 20px; " class="fa fa-bars noselect" >
</i>

  </span>
   <el-dropdown-menu slot="dropdown">
           <router-link style="color: black ; text-decoration: none" to="/setting">

    <el-dropdown-item class="markidea-dropdown-item">
            设置
      </el-dropdown-item>
              </router-link>
              <router-link style="color: black ; text-decoration: none" to="/admin">

    <el-dropdown-item v-if="isAdminUser" class="markidea-dropdown-item">
            网站管理
      </el-dropdown-item>
              </router-link>
    <el-dropdown-item class="markidea-dropdown-item" divided @click.native="showAboutPage = !showAboutPage">关于</el-dropdown-item>

    <el-dropdown-item class="markidea-dropdown-item" divided @click.native="handleLogout()">注销</el-dropdown-item>
  </el-dropdown-menu>  
  
  </el-dropdown>
<!-- </span> -->
  <!-- </span> -->
</div>
</el-header>


      <el-container  >
        <!-- 笔记本列表  -->
        <el-aside width="200px" class="notebooklist noselect" v-show="showAside ">
          <div style="margin:5px">
          <el-input clearable v-model="keyWord" @blur="keyWord = null" @keyup.enter.native="searchNotes" placeholder="搜索笔记"></el-input>
          </div>
        <div @contextmenu.prevent class="notebook" style="  padding-bottom: 10px;color:grey">
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

         <div v-for="item of notebookList" 
         v-bind:class="{chosenNotebook:curNotebook.notebookName === item.notebookName}"
            v-contextmenu:notebookRightMenu
            :key="item.notebookName" 
            >        <div v-if="toRenameNotebookName && toRenameNotebookName.length > 0 && toRenameNotebookName === item.notebookName"  class="notebook"  >
                    <el-input @blur="toRenameNotebookName = null"
                    v-model="destNotebookName" @keyup.enter.native="handleRenameNotebook" placeholder="新笔记本名" />
                    </div>

         <div class="notebook" @click="selectNoteList(item.notebookName)" v-else>📙  {{item.notebookName}}</div>

        </div> 
        <el-collapse @contextmenu.prevent.native accordion style="background-color: rgb(248, 248, 248);">
            <el-collapse-item style="background-color: rgb(248, 248, 248);">
              <template  slot="title">
        <div v-contextmenu:delNotesRightMenu  class="notebook" 
        style=" font-size: 15px; padding-bottom: 10px;color:grey;border-bottom:0px; background-color: rgb(248, 248, 248);
">垃圾桶</div>
              </template>
              <div v-contextmenu:delNoteRightMenu class="delnote" v-for="item of delNoteList" :key="item.id">
                
                  {{item.notebook}}/{{item.title}}
                </div>
                </el-collapse-item>
                
        </el-collapse>
      </el-aside>


        <!-- 笔记列表  -->
       <el-aside     
@contextmenu.prevent.native class="noselect noteList" width="300px" v-show="showAside && showNotes">
         <div  class="notebookInfo">
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
        v-bind:class="{chosenNote:curNote.noteTitle === item.title}"
                v-contextmenu:noteRightMenu

        v-for="item of curNotebook.noteList" 
        @click="selectNote(item.title, curNotebook.notebookName)"
        :key="item.title">
        <div class="notetitle">
          <span class="noselect">📝 </span>{{item.title}} 
  
                <span class="pull-right">
                                <span class="vditor-tooltipped vditor-tooltipped__nw " aria-label="修改尚未保存">

                <i v-if = "item.status === 2" aria-label="修改尚未保存" style = "color:lightgrey" 
                class="fa fa-warning  "
                ></i>
                                </span>

                                <!-- <el-tooltip effect="light" placement="top">
  <div slot="content"><div style="font">修改尚未保存</div> 是否删除草稿 <el-button plain="true" size="mini">是</el-button></div>
  <i v-if = "item.status === 2" aria-label="修改尚未保存" style = "color:lightgrey" 
                class="fa fa-warning  "
                ></i>
</el-tooltip> -->
                <span class="vditor-tooltipped vditor-tooltipped__nw" aria-label="公开笔记">

                <i v-if = "item.articleId" style = "color:lightgrey;padding-left:5px" class=" fa fa-eye "></i>
                </span>
                </span>
                </div>  

          
        <div class="notePreview">{{item.previewContent}}</div>  </div>
        
      </el-aside>

              <!-- 搜索结果列表  -->
       <el-aside class="noselect noteList" width="300px" v-if="showAside && showSearch">
         <div class="notebookInfo">
           <div>
           <span class="noselect">
🔎 </span>{{searchNotesName}}
           </div>
             
         </div>
        <div class="note noselect" 
        v-for="item of searchResult" 
                v-bind:class="{chosenNote:curNote.noteTitle === item.title && curNote.notebookName === item.notebookName}"

        @click="selectNote(item.title, item.notebookName)"
        :key="item.title + 'search'" >
        <!-- <i class="fa fa-file-text" style="margin-right: 5px"/> -->
        <div class="notetitle">
          <span class="noselect">📝 </span>{{item.notebookName}}/{{item.title}}</div>  
        <div>{{item.previewContent}}</div>  </div>
        
      </el-aside>

      <el-main v-show="!isMobile || !showAside" class="editor"  style="overflow: unset">
        <Editor  ref="editor" 
        @showHistory="handleShowHistory"
        @saveContent="handleSaveContent" @renameTitle="doHandleRenameTitle" />
      </el-main>
    
<el-aside width="220px" v-if="showHistory">

<el-dialog
  :visible.sync="showHistoryPreview"
  width="60%"
  @opened="handleOpenHistoryPrev"
  >
  <history-preview ref="historyPreview"></history-preview>
</el-dialog>

  <div style="padding-left: 10px;padding-top: 15px;">
  <div style="font-size:18px;padding-bottom: 5px; border"><span style="font-size:20px">🎛️ </span><strong>历史版本</strong></div>
               <div v-for="version of curNoteVersion" :key="version.ref" >
                <span style="font-size:13px;margin-right:5px">{{version.date}}</span>
                    <el-button v-show="version.ref !== curRef" size="mini" type="text" style="font-size:13px"
                    @click="handleRecover(version.ref)"
                      >恢复</el-button>
                      <el-button v-show="version.ref !== curRef" size="mini" type="text"  style="font-size:13px;" @click="handlePreviewHistory(version.ref)">预览</el-button>
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
        <v-contextmenu-item @click="allowRenameNotebook">重命名</v-contextmenu-item>

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


      <el-dialog
      :modal='false'
      :show-close='false'
      
      :center='true'
  :visible.sync="showAboutPage"
  width="300px"
  >
  
  <strong slot="title" style="font-size:30px">📕 MarkIdea</strong>
  <about ></about>
</el-dialog>

  </div>




</template>

<script>
import Editor from '@/components/Editor.vue'
import HistoryPreview from '@/components/HistoryPreview.vue'
import axios from 'axios'
import global from '@/global'
import util from '@/js/util'
import About from '@/components/About.vue'


export default {
  name: 'Home',
  components: {
    // HelloWorld,
    Editor,
    About,
    HistoryPreview
  },
  data(){
    return {
      pageTitle:this.$store.getters.getWebsiteTitle,

      config : {
        headers: {
          token : this.$store.getters.getToken,
          username : this.$store.getters.getUsername
        }
      },
      isAdminUser: this.$store.getters.getUserType === 0,
      // 搜索结果title
      searchNotesName: null,
      // 是否展示搜索页面
      showSearch:false,
      // 搜索结果
      searchResult:[],
      // 是否为移动端
      isMobile: false,
      // 搜索关键词
      keyWord:null,
      // 是否展示重命名选项
      showRenameOption: false,
      // 被删除笔记列表
      delNoteList:[],
      // 用于存放右键菜单选中的笔记信息
      noteRightMenuValues:{},
      // 待重命名笔记本
      toRenameNotebookName: null,

      // 重命名笔记本目标名
      destNotebookName: null,

      // 新建笔记本弹窗
      newNoteBookVisible:false,
      // 新建笔记按钮弹窗
      newNoteVisible:false,
      // 新笔记名
      newNotebookName: "",
      // 是否展示关于
      showAboutPage:false,
      // 定时器Id 用于清除
      timerId: null,
      showHistory: false,
      newNoteTitle: "",
      curNotebook: {
        notebookName: null,
        noteList:[]
      },
      curNote: {
        notebookName:null,
        noteTitle: null,
        content: ""      },
      curNoteVersion: [],
      curRef: null,
      showAside: true,
      showHistoryPreview: false, //是否展示历史预览
      // 是否展示笔记列表
      showNotes: true,
      notebookList: [],
      noteList: [


      ]
    }
  },
  methods: {
    
  refreshNotebookList(notebookName){
    // this.clearRenameInfo();
    axios.get(global.HOST_URL+"/note", this.config).then(res => {
      res = res.data;
      if(res.code === 0){
        this.notebookList = res.data;
        if(notebookName){
          this.doSwitchNotebook(notebookName);
          return ;

        }
        this.updateCurNotebookInfo()
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
    if(this.showSearch) {
      this.showSearch = false;
      this.showNotes = true;
    }
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
              this.handleDelTmpNote();
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
              this.doSwitchNote(notebook.noteList[0].title, notebookName, true);
            }else{
              this.clearCurNoteInfo();
            }
            return ;
          }
        }
  },
  updateCurNotebookInfo(){
    for (const notebook of this.notebookList) {
          if(notebook.notebookName === this.curNotebook.notebookName){
            this.curNotebook = notebook;
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
  selectNote(noteTitle, notebookName){
    if(this.isMobile) {
      this.showAside = false;
    }
    
    // 同一个笔记  不用动
    if(noteTitle === this.curNote.noteTitle && notebookName === this.curNote.notebookName){
      return ;
    }

    // 判断是否有未保存的内容
    if(this.isModifUnsaved()){
      this.$confirm('修改尚未保存', 'Confirm', {
          distinguishCancelAndClose: true,
          confirmButtonText: '保存',
          cancelButtonText: '丢弃'
        }).then(() => {

          this.saveContentAndSwitchNote(this.$refs.editor.getContent(), notebookName, noteTitle);
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
                            this.handleDelTmpNote();

      this.doSwitchNote(noteTitle, notebookName);
            }
          }
        )
    }else{
      this.doSwitchNote(noteTitle, notebookName);

    }
  },
  doSwitchNote(noteTitle, notebookName, auto){

    let url = global.HOST_URL+"/note/"+notebookName+"/"+noteTitle;
      axios.get(url, this.config).then(res => {
        res = res.data;
        if(res.code === 0){
          this.showHistory = false;
          let newCurNote = {
            noteTitle: noteTitle,
            content: res.data,
            notebookName: notebookName
          }
          this.curNoteVersion = [];
          this.curRef = null
          this.curNote = newCurNote;
          this.$refs.editor.setContent(noteTitle, res.data, notebookName);
          // 如果是移动端
    if(this.isMobile && !auto) {
      this.showAside = false;
    }
        }
      })

  },
  handleSaveContentAndSwitchNotebook(content, notebookName){
    let request = {
        content: content
    }
    let url = global.HOST_URL + "/note/" + this.curNote.notebookName + "/"+ this.curNote.noteTitle;
    axios.post(url, request, this.config).then(res => {
      res = res.data;
      if(res.code === 0){
        this.curNote.content = content;
        this.refreshNotebookList(notebookName);
      }


    })
  },
  saveContentAndSwitchNote(content, targetNotebookName, targetNoteTitle){
    let request = {
        content: content
    }
    let url = global.HOST_URL + "/note/" + this.curNote.notebookName + "/"+ this.curNote.noteTitle;
    axios.post(url, request, this.config).then(res => {
      res = res.data;
      if(res.code === 0){
        this.doSwitchNote(targetNoteTitle, targetNotebookName);
        this.refreshNotebookList();

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
  handleSaveContent(content, noteTitle, notebookName){
    this.showHistory = false;
    let request = {
        content: content
    }
    let url = global.HOST_URL + "/note/" + notebookName+ "/"+ noteTitle;
    axios.post(url, request, this.config).then(res => {
      res = res.data;
      if(res.code === 0){
        this.curNote.content = content;
        this.refreshNotebookList();
      }


    })
  },
  handleShowHistory(){
    this.showHistory = !this.showHistory;
    let url = global.HOST_URL+ "/note/" + this.curNotebook.notebookName  + "/" + this.curNote.noteTitle + "/history";
    axios.get(url, this.config).then(res => {
      res = res.data;
      if(res.code === 0){
        this.curNoteVersion = res.data;
        this.curRef = res.data[0].ref
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
    this.curNote.notebookName = this.curNotebook.notebookName;
    this.curNote.noteTitle = this.newNoteTitle;
    this.newNoteTitle = undefined;
    this.curNote.content = "";
    this.$refs.editor.setContent(this.curNote.noteTitle, "", this.curNotebook.notebookName);

    // 如果是移动端
    if(this.isMobile) {
      this.showAside = false;
    }

    this.newNoteVisible = false;
  },
  // 新建笔记本
  handleCreateNotebook(){
    let url = global.HOST_URL + "/note/" + this.newNotebookName;
    axios.put(url, {}, this.config).then(res => {
        res = res.data;
        if(res.code === 0){
          this.newNoteBookVisible = false;
          this.refreshNotebookList(this.newNotebookName);
          this.newNotebookName = null;

        }
    })
  },
  clearRenameInfo(){
    this.toRenameNotebookName = null;
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
  // 搜索笔记
searchNotes(){
  if(this.isModifUnsaved()) {
    this.$notify({
      type:"warning",
      message:"笔记尚未保存"
    })
    return ;
  }

      let url = global.HOST_URL + "/note/search";
      if(!this.keyWord) {
        this.$notify({
              type: 'warning',
              message: '搜索关键词不可为空'        })
              return ;

      }
      let request = {
        keyWord: this.keyWord
      }
      axios.post(url, request, this.config).then(
      res => {
        res = res.data;
        if(res.code === 0){
                    this.clearCurNoteInfo();

          this.searchNotesName = '"' + this.keyWord + '"的搜索结果' ;
          this.showSearch = true;
          this.showNotes = false;
          this.searchResult = res.data;
        }
      }
    )

},
 
  // 校验用户
    validateUserAndInit(){
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
    allowRenameNotebook() {
      this.toRenameNotebookName = this.notebookRightMenuValues.notebookName;
      this.destNotebookName = this.toRenameNotebookName;
    },
    handleRenameNotebook() {
      let url = global.HOST_URL+"/note/"+this.destNotebookName;
      let request = {
        move : true,
        srcNotebook : this.toRenameNotebookName
      }
            this.clearRenameInfo();
this.showHistory = false;
      axios.put(url, request, this.config).then(res => {
        res = res.data;
        if(res.code === 0) {
          res = res.data;
          if(request.srcNotebook === this.curNote.notebookName) {
            this.$refs.editor.setNotebookName(this.destNotebookName);
          }
          this.notebookList.forEach(notebook => {

            if(notebook.notebookName === request.srcNotebook) {
                notebook.notebookName = this.destNotebookName;
                notebook.noteList = res;
            }
          });
        } else {
            this.$notify({
              type: 'error',
              message: res.msg,
              duration: 1000
            });
        } 
      })

    },

    
    isCurNote(){
      if(this.noteRightMenuValues.notebookName !== this.curNotebook.notebookName){
        return false;
      }
      return this.noteRightMenuValues.noteTitle === this.curNote.noteTitle;
    },
    handleDelNote(){
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
    handleDelTmpNote() {
          let url = global.HOST_URL + "/note/" + this.curNote.notebookName + "/" + this.curNote.noteTitle + "?delDraft=true";
          axios.delete(url, this.config)

    },
    handleRenameNote(){
      
    this.$refs.editor.setTitleEditable(true);
    },
    doHandleRenameTitle(newTitle){
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
      let url = global.HOST_URL + "/note/" + targetNotebook + "/" + this.noteRightMenuValues.noteTitle;
      let param = {
        srcNotebook : this.noteRightMenuValues.notebookName,
        srcTitle : this.noteRightMenuValues.noteTitle,
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
      let url = global.HOST_URL + "/note/" + targetNotebook + "/" + this.noteRightMenuValues.noteTitle;
      let param = {
        srcNotebook : this.noteRightMenuValues.notebookName,
        srcTitle : this.noteRightMenuValues.noteTitle,
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
        this.refreshNotebookList();
      }
    })
  },

// 查询历史记录
handlePreviewHistory (ref) {
  this.showHistoryPreview = true
  this.previewRef = ref
},
handleOpenHistoryPrev() {
  this.$refs.historyPreview.setText("fdshiufhsiusdh745897384957489357")
  let url = global.HOST_URL + "/history/queryHistoryContent"
  let req = {
    notebookName: this.curNotebook.notebookName,
    noteTitle: this.curNote.noteTitle,
    versionRef: this.previewRef
  }
  axios.post(url, req, this.config).then(res => {
    res = res.data;
    if(res.code !== 0) {
      this.$notify({
              type: 'error',
              message: "获取历史版本内容失败",
              duration: 1000
          });
          return 
    }
    this.$refs.historyPreview.setText(res.data)
  })
},

  doInit(){
        this.refreshNotebookList();
        this.timerId = setInterval(() => {
          this.autoSaveNote();
        }, 10 * 1000);
        this.setIsMobile();
        window.onresize = this.setIsMobile;
},
setIsMobile() {

              this.isMobile = util.isMobile();
},
  isModifUnsaved(raw){

    if(this.$refs.editor.getContent(raw).charCodeAt() === 10 && this.curNote.content === ""){
        return false;
    }
    return this.curNote.content !== this.$refs.editor.getContent(raw);
  },
  autoSaveNote() {
    if(!this.isModifUnsaved(true)) {
      return ;
    }
    if(this.$refs.editor.getContent(true) === this.curNote.tmpContent) {
      return ;
    }
    if(!this.curNote || !this.curNote.noteTitle || this.curNote.noteTitle.length === 0) {
      return ;
    }
    let  content = this.$refs.editor.getContent(true);
    let request = {
        content: content,
        tmpSave: true
    }
    let url = global.HOST_URL + "/note/" + this.curNote.notebookName + "/"+ this.curNote.noteTitle;
    axios.post(url, request, this.config).then(res => {
      res = res.data;
      if(res.code === 0){
        this.curNote.tmpContent = content;
        // this.curNote.content = content;
      }
    })

  }
  },
  mounted(){
    document.title = this.$store.getters.getWebsiteTitle;
    this.validateUserAndInit();
  },
  beforeRouteLeave(to, from, next) {
    clearInterval(this.timerId)
    next()
  }
}
</script>
<style >
.notebook{
  /* margin: 15px; */
  color: rgb(41, 38, 38);
  font-size: 18px;
  margin-top: 1px;
  margin-left: 10px;
  margin-right: 10px;
  padding: 10px;
  padding-top: 15px;
  padding-bottom: 15px;
  /* background-color: rgb(247, 244, 242); */

  /* border-bottom:1px solid rgb(240, 237, 237); */
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
  font-size: 26px;
  /* font-weight: bold; */
}

.notebooklist{
  /* height:200px; */
            background-color: rgb(248, 248, 248);

      /* border: 1px solid rgb(240, 237, 237); */

}
.chosenNotebook{
      background-color: rgb(252, 251, 251);
  border-left: 3px solid rgb(199, 199, 199);
}
.note{
  padding: 10px;

}

.notetitle{
  /* font-weight: bold; */
  margin-bottom: 5px;
}

.header{
  /* margin-top: 10px; */
  /* padding-top: 10px; */
  color: rgb(24, 21, 17);
  /* line-height: 52px; */
  font-size: 25px;
    display:table-cell; 
    vertical-align:bottom;
  /* border-top-left-radius:5px;
    border-top-right-radius:5px; */
          /* border: 1px solid rgb(240, 237, 237); */


        /* background-color: rgb(252, 250, 250); */

}
.editor{
        /* border: 1px solid rgb(240, 237, 237); */

}
.noteList{
          /* border: 1px solid rgb(240, 237, 237); */
      background-color: rgb(251, 250, 250);

}
.rightMenu{
  min-width: 100px;
}
.delnote{
  /* margin: 5px 15px 5px 15px; */
  padding: 6px 16px 6px 20px;
  color: gray;
  font-size: 15px;
      background-color: rgb(251, 250, 250);

  /* border-bottom:1px solid rgb(240, 237, 237); */
  /* border-top:1px solid rgb(240, 237, 237); */

}
.lightGreyBackground{
  background-color: lightgray;
}
.markidea-dropdown-item{
  min-width: 45px;
  text-align: center;
}
.chosenNote{
  background-color: white;
  /* border-left: 3px solid rgb(199, 199, 199); */
}

.notePreview{
  font-size: 14px;
  color: rgb(87, 87, 87);
}

</style>
