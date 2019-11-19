import Vue from 'vue';
import VueRouter from 'vue-router';
import Statistics from '../views/Statistics.vue';

Vue.use(VueRouter);

/**
 * 重写路由的push方法
 */
const routerPush = VueRouter.prototype.push;
VueRouter.prototype.push = function push(location: any) {
  return (routerPush.call(this, location) as any).catch((error: any) => error);
};

const routes = [{
  path: '/statistics',
  alias: '/',
  name: 'statistics',
  component: Statistics
}, {
  path: '/fastRun',
  alias: '/',
  name: 'fastRun',
  component: () => import('../views/FastRun.vue')
}];

const router = new VueRouter({
  // mode: 'history',
  base: process.env.BASE_URL,
  routes
});

export default router;
