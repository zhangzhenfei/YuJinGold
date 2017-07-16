const TOGGLE_MAIN_NAV_MINIVARIANT = 'TOGGLE_MAIN_NAV_MINIVARIANT'
const SHOW_MAIN_NAV_MINIVARIANT = 'SHOW_MAIN_NAV_MINIVARIANT'
const TOGGLE_MAIN_NAV_CLIPPED = 'TOGGLE_MAIN_NAV_CLIPPED'
const TOGGLE_MAIN_NAV_DRAWER = 'TOGGLE_MAIN_NAV_DRAWER'
const SET_MAIN_NAV_DRAWER = 'SET_MAIN_NAV_DRAWER'

// state
const state = {
  title: '御锦黄金支撑平台',
  clipped: true,
  drawer: true,
  fixed: false,
  miniVariant: false,
  navs: [
    {
      action: 'assignment_ind',
      title: '行情中心',
      to: { name: 'MarketCenterDefault' }
    }
  ]
}

// getters
const getters = {}

// mutations
const mutations = {
  [TOGGLE_MAIN_NAV_MINIVARIANT](state) {
    state.miniVariant = !state.miniVariant
  },
  [SHOW_MAIN_NAV_MINIVARIANT](state) {
    state.miniVariant && (state.miniVariant = false)
  },
  [TOGGLE_MAIN_NAV_CLIPPED](state) {
    state.clipped = !state.clipped
  },
  [TOGGLE_MAIN_NAV_DRAWER](state) {
    state.drawer = !state.drawer
  },
  [SET_MAIN_NAV_DRAWER](state, payload) {
    state.drawer = payload
  }
}

// actions
const actions = {
  toggleMainNavMiniVariant({ commit, state }) {
    commit(TOGGLE_MAIN_NAV_MINIVARIANT)
  },
  showMainNavMiniVariant({ commit, state }) {
    commit(SHOW_MAIN_NAV_MINIVARIANT)
  },
  toggleMainNavClipped({ commit, state }) {
    commit(TOGGLE_MAIN_NAV_CLIPPED)
  },
  toggleMainNavDrawer({ commit, state }) {
    commit(TOGGLE_MAIN_NAV_DRAWER)
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
