import Vue from 'vue'
import Router from 'vue-router'

import Web from './Web/index'
import Admin from './Admin/index'

Vue.use(Router)

const Login = resolve => require(['@/views/Admin/Login'], resolve)

const router = new Router({
  routes: [
    Web,
    Admin,
    {
      path: '/login',
      name: 'Login',
      component: Login
    }
  ]
})

// 注册全局钩子用来拦截导航
router.beforeEach((to, from, next) => {
  // 获取store里面的token
  let token = localStorage.getItem('TOKEN')
  // 判断要去的路由有没有requiresAuth
  if (to.meta.requiresAuth) {
    if (token) {
      next()
    } else {
      next({
        path: '/login',
        query: { redirect: to.fullPath } // 将刚刚要去的路由path（却无权限）作为参数，方便登录成功后直接跳转到该路由
      })
    }
  } else {
    next() // 如果无需token,那么随它去吧
  }
})

export default router
