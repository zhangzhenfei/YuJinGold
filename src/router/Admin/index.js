import MarketCenter from './market-center'

export default {
  path: '/admin',
  name: 'Admin',
  meta: {
    requiresAuth: true
  },
  component: resolve => require(['@/views/Admin/index'], resolve),
  children: [MarketCenter]
}
