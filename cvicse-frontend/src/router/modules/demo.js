import layoutHeaderAside from '@/layout/header-aside'

const meta = { cache: true, auth: 'check' }

export default {
  path: '/demo',
  name: 'demo',
  meta,
  redirect: { name: 'demo-auth' },
  component: layoutHeaderAside,
  children: (pre => [
    {
      path: 'auth',
      name: `${pre}auth`,
      component: () => import('@/pages/demo/auth'),
      meta: { ...meta, title: '权限测试' }
    },
    {
      path: 'page1',
      name: `${pre}page1`,
      component: () => import('@/pages/demo/page1'),
      meta: { ...meta, title: '页面 1' }
    },
    {
      path: 'page2',
      name: `${pre}page2`,
      component: () => import('@/pages/demo/page2'),
      meta: { ...meta, title: '页面 2' }
    },
    {
      path: 'page3',
      name: `${pre}page3`,
      component: () => import('@/pages/demo/page3'),
      meta: { ...meta, title: '页面 3' }
    }
  ])('demo-')
}