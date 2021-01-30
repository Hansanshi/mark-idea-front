import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

let localInfo = {};
if(localStorage.localInfo){
  localInfo = JSON.parse(localStorage.localInfo)
}

export default new Vuex.Store({
  state: {
    info : localInfo,
    website:{}
  },
  mutations: {
    setWebsiteTitle(state, title) {
      state.website.title = title
    },
    setToken(state, token){
      state.info.token = token;
      localStorage.localInfo = JSON.stringify(localInfo);
    },
    setEditorConfig(state, editorConfig){
      state.info.editorConfig = editorConfig;
      localStorage.localInfo = JSON.stringify(localInfo);

    },
    setLocalInfo(state, localInfo){
      state.info = localInfo;
      localStorage.localInfo = JSON.stringify(localInfo);
    }
  },
  getters: {
    getToken(state){
        return state.info.token;
    },
    getUsername(state){
        return state.info.username;
    },
    getUserType(state) {
      return state.info.type;
    },
    getEditorConfig(state) {
      return state.info.editorConfig;
    },
    getWebsiteTitle(state) {
      return state.website.title;
    },
  },
  actions: {
  },
  modules: {
  }
})
