import Vue from 'vue'
import { store } from '@/store'
import Router from 'vue-router'
import AppRouter from '@/route/router';

Vue.use(Router)

const router = new Router({
  mode: 'history',
  routes: AppRouter
});

router.beforeEach((to: any, from: any, next: any) => {
  if (to.meta.isMetamask) {
    store.watch((getter: any) => {
      if (getter.web3.account && getter.web3.account.address === undefined) {
        next({ name: 'home' });
      } else {
        next();
      }
    }, () => {});
  } else {
    next();
  }
});

export default router
