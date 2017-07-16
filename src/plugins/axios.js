import axios from 'axios'

let options = {
  baseURL: 'http://localhost:18080',
  timeout: 300000 // 50000ms的超时验证
}
// 创建一个axios实例
const instance = axios.create(options)
instance.defaults.headers.post['Content-Type'] =
  'application/json;charset=UTF-8'

export default instance
