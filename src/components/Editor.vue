<template>
<div>
          
     <div v-show="notebookName && title && title.length > 0" class="title">
            <span v-if="!showEditTitle" class="noselect">
✏️ </span>
            <span v-if="!showEditTitle">{{title}}</span>
            <span v-if="contentModfied" style="color:lightgrey;font-size:14px;padding-left:5px;font-weight:lighter">- 已编辑</span>
            <el-input @blur="setTitleEditable(false)" v-model="newTitle" v-if="showEditTitle" @keyup.enter.native="renameTitle"/>
            </div>
          <div v-show="notebookName && title && title.length > 0" id="vditor"  class="vditor"/>
</div>
</template>

<script>
import Vditor from 'vditor'
import global from '@/global'
import axios from 'axios'



export default {
  name: 'Editor',
  data(){
    return {
      showEditTitle:false,
      config : {
        headers: {
          token : this.$store.getters.getToken,
          username : this.$store.getters.getUsername
        }
      },
      editorConfig: this.$store.getters.getEditorConfig,
      contentModfied:false,
      notebookName:null,
      originContent:"",
        title:"",
        newTitle: null,
        vditor: null,
        toolbar: [
            {
                hotkey: "⌘H",
                icon: "<i  class='fa fa-header fa-lg'></i>",
                name: "headings",
                tipPosition: "ne",
            },
            {
              hotkey: "⌘B",
              name: "bold",
              prefix: "**",
              suffix: "**",
              tipPosition: "ne",
              icon: "<i class='fa fa-bold fa-lg'></i>"
            },
            {
              hotkey: "⌘I",
              icon: "<i class='fa fa-italic fa-lg'></i>",
              name: "italic",
              prefix: "*",
              suffix: "*",
              tipPosition: "ne",
              },
            {
              hotkey: "⌘L",
              icon: "<i class='fa fa-strikethrough fa-lg'></i>",
              name: "strike",
              prefix: "~~",
              suffix: "~~",
              tipPosition: "ne",
            },
            {
              hotkey: "⌘K",
              icon: "<i class='fa fa-link fa-lg'></i>",
              name: "link",
              prefix: "[",
              suffix: "](https://)",
              tipPosition: "n",
          },"table",
            "|",
            {
              // hotkey: "⌘L",
              icon: "<i class='fa fa-list-ul fa-lg'></i>",
              name: "list",
              prefix: "* ",
              tipPosition: "n",
            }, {
              hotkey: "⌘O",
              icon: "<i class='fa fa-list-ol fa-lg'></i>",
              name: "ordered-list",
              prefix: "1. ",
              tipPosition: "n",
            },
            {
              hotkey: "⌘J",
              icon: "<i class='fa fa-check-square-o fa-lg'></i>",
              name: "check",
              prefix: "* [ ] ",
              tipPosition: "n",
            },
            {
        hotkey: "⌘⇧I",
        icon: "<i class='fa fa-outdent fa-lg'></i>",
        name: "outdent",
        tipPosition: "n",
    }, {
        hotkey: "⌘⇧O",
        icon: "<i class='fa fa-indent fa-lg'></i>",
        name: "indent",
        tipPosition: "n",
    },
            "|",
            {
        hotkey: "⌘;",
        icon: "<i class='fa fa-quote-left fa-lg'></i>",
        name: "quote",
        prefix: "> ",
        tipPosition: "n",
    },
            "line",
            "code",
            "inline-code",
            "|",
            "upload",
            "undo",
            "redo",          
            //  {
            //   name: "enter",
            //   tip: "换行",
            //   icon: '<svg version="1.1" id="layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 16 16" style="enable-background:new 0 0 16 16;" xml:space="preserve"><style type="text/css">.st0{fill:#2C2C2C;}</style><path class="st0" d="M0.7,0.6c0-0.3,0.2-0.5,0.5-0.5c0,0,0,0,0,0h14.1c0.3,0,0.5,0.2,0.5,0.5c0,0,0,0,0,0v0.1c0,0.3-0.2,0.5-0.5,0.5l0,0H1.2C0.9,1.1,0.7,0.9,0.7,0.6C0.7,0.7,0.7,0.6,0.7,0.6z M0.7,4.6c0-0.3,0.2-0.5,0.5-0.5h14.1c0.3,0,0.5,0.2,0.5,0.5v0v0.1c0,0.3-0.2,0.5-0.5,0.5l0,0H1.2C0.9,5.1,0.7,4.9,0.7,4.6C0.7,4.7,0.7,4.6,0.7,4.6z M0.7,8.6c0-0.3,0.2-0.5,0.5-0.5c0,0,0,0,0,0h12c0.3,0,0.5,0.2,0.5,0.5v0v0.1c0,0.3-0.2,0.5-0.5,0.5h0h-12C0.9,9.2,0.7,8.9,0.7,8.6L0.7,8.6C0.7,8.7,0.7,8.6,0.7,8.6z M0.7,12.6c0-0.3,0.2-0.5,0.5-0.5c0,0,0,0,0,0h5.5c0.3,0,0.5,0.2,0.5,0.5l0,0v0.1c0,0.3-0.2,0.5-0.5,0.5h0H1.2C0.9,13.2,0.7,13,0.7,12.6L0.7,12.6C0.7,12.7,0.7,12.6,0.7,12.6z"/><path class="st0" d="M15.2,8.1c-0.3,0-0.5,0.2-0.5,0.5v0v3.1c0,0.3-0.2,0.5-0.5,0.5h0h-2.8v-2l-2.8,2.1c-0.2,0.2-0.2,0.5-0.1,0.7c0,0,0.1,0.1,0.1,0.1l2.8,2.1v-2h3.8c0.3,0,0.5-0.2,0.5-0.5v0V8.6c0-0.3-0.2-0.5-0.5-0.5h0C15.3,8.1,15.2,8.1,15.2,8.1z"/></svg>',
            //   click: () => {
            //     this.vditor.insertValue('\n<br/>\n');
            //   }
            // },
            "|",
             "edit-mode",
            {
              name:"history",
              tip: "历史版本",
              icon: "<i class='fa fa-history fa-lg'></i>",
              click: () => {
                this.showHistory();
              }
            },
            "outline",
            {
              hotkey: '⌘s',  
              name: "save",
              tip: "保存",
              icon: '<i class="fa fa-save fa-lg"/>',
              click: () => {
                this.saveContent(this.vditor.getValue());
              }
            },
            {
                name: "more",
                toolbar: [
                    // "content-theme",
                    "export",
                    "preview",
                    {
              name: "share",
              tip: "公开",
              icon: '公开',
              click: () => {
                this.publishNote();
              }
            }
                ],
            }
        ]
    }
  },
  mounted(){
    this.init();
    this.vditor.clearCache();
  },
  created () {
      let element = document.querySelector('#customEditorStyle');
    
    if(this.editorConfig.enableCustomStyle && this.editorConfig.customStylePath !== null && this.editorConfig.customStylePath.length > 5) {
      if(element) {
        element.href = this.editorConfig.customStylePath ;
        return ;
      }

      const link = document.createElement("link");
      link.href = this.editorConfig.customStylePath ;
      link.rel = "stylesheet";
      link.id = "customEditorStyle"
      document.querySelector("head").appendChild(link)
    } else {
            if(element) {
            document.querySelector("head").removeChild(element)

            }

            import ("@/assets/vditor.css");
    }
  },
  methods: {
    init(){
      const options = {
        counter:{
          enable:this.editorConfig.enableCounter,
          type: 'text'
        },
        after: () => {
          // 设置大纲固定
          document.querySelector('.vditor-outline__content').classList.add("vditor-toolbar--pin")
          document.querySelector('.vditor-outline').classList.add("vditor-toolbar--pin")
        },
        input: () => {
          this.contentModfied = (this.vditor.getValue() !== this.originContent);
        },
          mode: this.editorConfig.editMode,
          toolbar: this.toolbar,
          toolbarConfig:{
            pin:true
          },
          outline: {
            position: this.editorConfig.outlinePosition,
            enable:this.editorConfig.enableOutline
          },
          value:"",
          preview: {
            hljs:{
              enable: this.editorConfig.enableHighLight,
                style: this.editorConfig.codeStyle,
                lineNumber: this.editorConfig.enableLineNumber
            },
            maxWidth : 4000,

          },
          upload : {
            url : global.HOST_URL + "/file/vditor",
            headers: this.config.headers
          }
          
      }
      this.vditor = new Vditor('vditor', options)
    },
    setContent(title, value, notebookName){
      this.contentModfied = false;
      this.notebookName = notebookName
      this.showEditTitle = false;
      this.vditor.setValue(value);
      this.originContent = this.vditor.getValue();
      this.title = title;     
      this.newTitle = title;
    },
    clear(){
      this.vditor.setValue("");
            this.notebookName = null
      this.showEditTitle = false;
            this.title = null;

    },
    setTitleEditable(editable){
      this.showEditTitle = editable;
    },
    /**
     * raw 是否直接获取值  不进行去空行
     */
    getContent(raw){
      if(raw) {
        return this.vditor.getValue();
      }
      this.vditor.setValue(this.vditor.getValue());
      return this.vditor.getValue();
    },
    getTitle(){
      return this.title;
    },
    setNotebookName(notebookName) {
        this.notebookName = notebookName
    },
    publishNote() {
      let req = {
        notebookName: this.notebookName,
        noteTitle: this.title
      }
      axios.post(global.HOST_URL + "/article", req, this.config).then(res => {
        res = res.data;
        if(res.code === 0) {
          res = res.data;
          this.$notify({
            type:"success",
            message:"公开成功，地址为: " + window.location.host + "/#/article/" + this.config.headers.username + "/" + res.articleId,
            duration: 10000
          })
        }
      })
    },
    saveContent(){
      if(!this.title){
        this.$notify({
          type:"warning",
          message: "标题为空",
          duration: 1000
        })
        return ;
      }
      if(!this.notebookName){
        this.$notify({
          type:"warning",
          message: "请选择笔记本",
          duration: 1000
        })
        return ;
      }
      
        this.vditor.setValue(this.vditor.getValue());
        let content = this.vditor.getValue();
        this.contentModfied = false;
        this.originContent = content;
        this.$emit('saveContent', content, this.title, this.notebookName);
    },
    showHistory(){
      this.$emit('showHistory');
    },
    renameTitle(){
      this.$emit('renameTitle', this.newTitle);
    },
    handleClose(done) {
        this.$confirm('确认关闭？')
          .then(() => {
            done();
          })
          .catch(() => {});
      }
  }
}
</script>
<style>
.title{
  font-size: 24px;
  /* font-weight: bold; */
  margin-bottom: 5px;
}
.vidtor{
  min-height: 200px;
}
</style>