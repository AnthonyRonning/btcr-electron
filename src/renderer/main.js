import Vue from 'vue'
import axios from 'axios'

import App from './App'
import router from './router'
import store from './store'
import Vuetify from 'vuetify'
import 'vuetify/dist/vuetify.min.css'
import 'material-design-icons-iconfont/dist/material-design-icons.css'
import vSelect from 'vue-select'
import VueClipboard from 'vue-clipboard2'
import NeDB from 'nedb-core'

if (!process.env.IS_WEB) Vue.use(require('vue-electron'))
Vue.http = Vue.prototype.$http = axios
Vue.config.productionTip = false
Vue.use(Vuetify)
Vue.component('v-select', vSelect)
Vue.use(VueClipboard)
Vue.use(NeDB)

/* eslint-disable no-new */
new Vue({
  inheritAttrs: false,
  components: { App },
  router,
  store,
  template: '<App/>'
}).$mount('#app')
