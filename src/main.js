// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'

// 引入UI框架vuetify
import Vuetify from 'vuetify'
Vue.use(Vuetify)

// 引入状态管理vuex
import store from './store'

// 引入路由同步
import { sync } from 'vuex-router-sync'
sync(store, router) // 同步路由

// 表单校验
import zhCN from 'vee-validate/dist/locale/zh_CN'
import VeeValidate, { Validator } from 'vee-validate'
Validator.addLocale(zhCN)
Vue.use(VeeValidate, {
  locale: 'zh_CN',
  errorBagName: 'vErrors'
})

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  template: '<App/>',
  components: { App }
})
