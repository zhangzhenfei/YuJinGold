import axios from '@/plugins/axios-admin'

/**
 * 批量抓取来源数据（服务器从API中转发）
 */
export const fetchSources = async () => {
  const data = await axios.post('/admin/market-center/fetchSources')
  return data
}

/**
 * 查找市场行情设置列表
 */
export const find = async () => {
  const data = await axios.post('/admin/market-center/find')
  return data
}

/**
 * 查找市场行情条件查找
 */
export const findByQuery = async query => {
  const data = await axios.post('/admin/market-center/findByQuery', query)
  return data
}

/**
 * 下载行情设置
 */
export const downloadMarketGold = () => {
  // axios.post('/admin/market-center/download')
  // window.open('http://localhost:18080/view/market-center/download', '_self')
  window.open(
    'http://yujingold.bceapp.com/view/market-center/download',
    '_self'
  )
}

/**
 * 增加行情设置
 * @param {Object} params 行情设置数据
 */
export const addMarketGold = async params => {
  const data = await axios.post('/admin/market-center/saveOrUpdate', params)
  return data
}

/**
 * 增加行情设置
 * @param {Object} params 行情设置数据
 */
export const delMarketGold = async id => {
  const data = await axios.post('/admin/market-center/del', { id })
  return data
}
