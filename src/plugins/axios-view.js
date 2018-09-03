import axios from 'axios'

// http://yujingold-api.yujingold.top
// http://localhost:18080
let options = {
  baseURL: 'http://yujingold-api.yujingold.top', // dev
  // baseURL: 'http://jinyugold.duapp.com', // prod
  timeout: 300000 // 300000ms的超时验证
}
// 创建一个axios实例
const instance = axios.create(options)
instance.defaults.headers.post['Content-Type'] =
  'application/json;charset=UTF-8'

export default instance
