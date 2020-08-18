import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import ElementUI from 'element-ui';
// import 'element-ui/lib/theme-chalk/index.css';
import '@/assets/theme/index.css'
import contentmenu from 'v-contextmenu'
import 'v-contextmenu/dist/index.css'

Vue.config.productionTip = false
Vue.use(ElementUI)
Vue.use(contentmenu)

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
