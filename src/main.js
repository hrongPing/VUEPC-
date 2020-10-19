import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './plugins/element.js'
import '@/assets/font/iconfont.css'
import { axios } from '@/plugins/axios'
import TreeTable from 'vue-table-with-tree-grid'
import VueQuillEditor from 'vue-quill-editor'
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
Vue.use(VueQuillEditor)
Vue.config.productionTip = false
Vue.prototype.$http = axios
Vue.component('tree-table', TreeTable)
Vue.filter('dateFormat', function (originval) {
  const date = new Date(originval)
  const y = date.getFullYear()
  const M = (date.getMonth() + 1 + '').padStart(2, '0')
  const d = (date.getDate() + '').padStart(2, '0')
  const h = (date.getHours() + '').padStart(2, '0')
  const m = (date.getMinutes() + '').padStart(2, '0')
  const s = (date.getSeconds() + '').padStart(2, '0')
  return `${y}-${M}-${d} ${h}:${m}:${s} `
})
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
