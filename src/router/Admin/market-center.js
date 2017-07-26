// ******************************行情中心******************************
const MarketCenter = resolve =>
  require(['@/views/Admin/Market-Center/index'], resolve)
const MarketCenterDefault = resolve =>
  require(['@/views/Admin/Market-Center/List'], resolve)
const MarketCenterEdit = resolve =>
  require(['@/views/Admin/Market-Center/Edit'], resolve)

export default {
  path: 'market-center',
  component: MarketCenter,
  meta: {
    requiresAuth: true
  },
  children: [
    {
      path: '',
      name: 'MarketCenterDefault',
      meta: {
        requiresAuth: true
      },
      component: MarketCenterDefault
    },
    {
      path: 'edit/:id?',
      name: 'MarketCenterEdit',
      meta: {
        requiresAuth: true
      },
      component: MarketCenterEdit
    }
  ]
}
