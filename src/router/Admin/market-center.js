// ******************************行情中心******************************
const MarketCenter = resolve =>
  require(['@/views/Admin/Market-Center/index'], resolve)
const MarketCenterDefault = resolve =>
  require(['@/views/Admin/Market-Center//List'], resolve)
const MarketCenterEdit = resolve =>
  require(['@/views/Admin/Market-Center//Edit'], resolve)

export default {
  path: 'market-center',
  component: MarketCenter,
  children: [
    {
      path: '',
      name: 'MarketCenterDefault',
      component: MarketCenterDefault
    },
    {
      path: 'edit/:id?',
      name: 'MarketCenterEdit',
      component: MarketCenterEdit
    }
  ]
}
