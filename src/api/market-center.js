import axios from '@/plugins/axios'

/**
 * 批量抓取来源数据（服务器从API中转发）
 */
export const fetchSources = async () => {
  const data = await axios.post('/market-center/fetchSources')
  return data
}

/**
 * 查找市场行情设置列表
 */
export const find = async query => {
  const data = await axios.post('/market-center/find', query)
  return data
}

/**
 * 增加行情设置
 * @param {Object} params 行情设置数据
 */
export const addMarketGold = async params => {
  const data = await axios.post('/market-center/saveOrUpdate', params)
  return data
}

/**
 * 增加行情设置
 * @param {Object} params 行情设置数据
 */
export const delMarketGold = async id => {
  const data = await axios.post('/market-center/del', { id })
  return data
}
