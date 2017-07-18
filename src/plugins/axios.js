import axios from 'axios'

// http://jinyugold.duapp.com
// http://localhost:18080
let options = {
  baseURL: 'http://jinyugold.duapp.com',
  timeout: 300000 // 300000ms的超时验证
}
// 创建一个axios实例
const instance = axios.create(options)
instance.defaults.headers.post['Content-Type'] =
  'application/json;charset=UTF-8'

export default instance
