import Vue from 'vue'
import Router from 'vue-router'

import Web from './Web/index'
import Admin from './Admin/index'

Vue.use(Router)

export default new Router({
  routes: [Web, Admin]
})
