import axios from 'axios'

let options = {
  baseURL: 'http://localhost:8081',
  timeout: 50000 // 50000ms的超时验证
}
// 创建一个axios实例
const instance = axios.create(options)
instance.defaults.headers.post['Content-Type'] =
  'application/json;charset=UTF-8'

export default instance
