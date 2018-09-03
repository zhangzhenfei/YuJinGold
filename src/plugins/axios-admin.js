import axios from 'axios'
import router from '../router/index'

// http://yujingold-api.yujingold.top/
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

axios.interceptors.request.use = instance.interceptors.request.use

// request拦截器
instance.interceptors.request.use(
  config => {
    const token = localStorage.getItem('TOKEN')
    if (token) {
      config.headers.Authorization = `token ${token}`
    }
    return config
  },
  err => {
    return Promise.reject(err)
  }
)

// respone拦截器
instance.interceptors.response.use(
  response => {
    return response
  },
  error => {
    // 默认除了2XX之外的都是错误的，就会走这里
    if (error.response) {
      switch (error.response.status) {
        case 401:
          localStorage.setItem('TOKEN', '')
          router.replace({
            // 跳转到登录页面
            name: 'Login',
            query: { redirect: router.currentRoute.fullPath } // 将跳转的路由path作为参数，登录成功后跳转到该路由
          })
      }
    }
    return Promise.reject(error.response.data)
  }
)
export default instance
