import { createRouter, createWebHashHistory, createWebHistory } from 'vue-router';

// 页面路由创建
const router = createRouter({
  // 使用hash模式
  history: createWebHistory(import.meta.env.BASE_URL),
  // 路由结构
  routes: [
    {
      path: '/:catchAll(.*)',
      component: () => import('../views/ListHome.vue'),
    },
    {
      path: '/:name/:value/',
      component: () => import('../views/ListHome.vue'),
    },
    {
      path: '/docs/:file/',
      component: () => import('../views/Blog.vue'),
    },
  ],
});

export default router;
