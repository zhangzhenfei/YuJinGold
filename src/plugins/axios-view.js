import axios from 'axios'

const devUrl = 'http://localhost:18080'
const prodUrl = 'http://yujingold.bceapp.com'

let options = {
  baseURL: process.env.NODE_ENV === 'production' ? prodUrl : devUrl,
  timeout: 300000 // 300000ms的超时验证
}
// 创建一个axios实例
const instance = axios.create(options)
instance.defaults.headers.post['Content-Type'] =
  'application/json;charset=UTF-8'

export default instance
