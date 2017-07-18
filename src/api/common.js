import axios from '../plugins/axios-view'

/**
 * 登录接口
 * @param {string} username 用户名
 * @param {string} password 密码
 */
export const login = async (username, password) => {
  const data = await axios.post('/auth/login', { username, password })
  return data
}
