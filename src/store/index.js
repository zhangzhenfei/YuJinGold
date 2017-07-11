import Vue from 'vue'
import Vuex from 'vuex'
import admin from './modules/Admin/index'
// import web from './modules/Web/index'
import createLogger from '@/plugins/logger'

Vue.use(Vuex)

const debug = process.env.NODE_ENV !== 'production'

export default new Vuex.Store({
  modules: {
    admin
  },
  strict: debug,
  plugins: debug ? [createLogger()] : []
})
