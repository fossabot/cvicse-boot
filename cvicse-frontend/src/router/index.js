import Vue from 'vue'
import VueRouter from 'vue-router'

// 进度条
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'

import store from '@/store/index'

import util from '@/libs/util.js'
import { checkPermission } from '@/libs/auth.js'

// 路由数据
import routes from './routes'

Vue.use(VueRouter)

// 导出路由 在 main.js 里使用
const router = new VueRouter({
  routes
})

/**
 * 路由拦截
 * 权限验证
 */
router.beforeEach((to, from, next) => {
  // 进度条
  NProgress.start()
  // 关闭搜索面板
  store.commit('d2admin/search/set', false)
  if (to.name === '404') {
    if (!from.name) {
      next()
    } else {
      next(new Error(`访问路径 “${to.fullPath}” 不存在，如有疑问请与管理员联系`))
      NProgress.done()
    }
  } else if (to.matched.some(r => r.meta.requiresAuth)) {
    // 验证当前路由所有的匹配中是否需要有登录验证的
    // 这里暂时将cookie里是否存有token作为验证是否登录的条件
    // 请根据自身业务需要修改
    const token = util.cookies.get('token')
    if (token && token !== 'undefined') {
      // 已登录，则进行许可检查
      if (
        !to.matched.some(r => r.meta.requiresAuth === 'check') ||
        checkPermission(to.fullPath)
      ) {
        next()
      } else {
        // 无权访问时显示提示信息
        // 产生该异常原因有：1、权限配置不合理，显示了无权访问的按钮等；2、地址栏输入无权访问的路径。
        // 以上情况均需要提醒管理员
        if (!from.name) {
          next({ name: '403' })
        } else {
          next(new Error(`未授权访问 “${to.fullPath}”，如有疑问请与管理员联系`))
        }
        NProgress.done()
      }
    } else {
      // 没有登录的时候跳转到登录界面
      // 携带上登陆成功之后需要跳转的页面完整路径
      let path = { name: 'login' }
      if (to.fullPath !== '/' && to.fullPath !== '/index') {
        path.query = { redirect: to.fullPath }
      }
      next(path)
      // https://github.com/d2-projects/d2-admin/issues/138
      NProgress.done()
    }
  } else {
    // 不需要身份校验 直接通过
    next()
  }
})

router.afterEach(to => {
  // 进度条
  NProgress.done()
  // 需要的信息
  const app = router.app
  const { name, params, query, fullPath } = to
  // 多页控制 打开新的页面
  app.$store.dispatch('d2admin/page/open', { name, params, query, fullPath })
  // 更改标题
  util.title(to.meta.title)
})

router.onError(err => {
  router.app.$message.error(err.message)
  Vue.config.errorHandler(err, router, err.message)
})

export default router
