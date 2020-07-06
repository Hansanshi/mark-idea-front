import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

let localInfo = {};
if(localStorage.localInfo){
  localInfo = JSON.parse(localStorage.localInfo)
}

export default new Vuex.Store({
  state: {
    info : localInfo
  },
  mutations: {
    setToken(state, token){
      state.info.token = token;
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
    }
  },
  actions: {
  },
  modules: {
  }
})
