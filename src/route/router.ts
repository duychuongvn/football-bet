const AppRouter = [
  {
    path: '',
    component: () => import('@/layout/client/client.component.vue'),
    redirect: 'home',
    children: [
      {
        path: '/',
        name: 'home',
        component: () => import('@/views/home/home.component.vue'),
      },
      {
        path: '/profile',
        name: 'profile',
        component: () => import('@/views/profile/profile.component.vue'),
        meta: {
          isMetamask: true
        }
      },
      {
        path: '/match-details/:key',
        name: 'match-details',
        component: () => import('@/views/matches-details/matches-details.component.vue'),
        meta: {
          isMetamask: true
        },
        beforeEnter(to: any, from: any, next: any) {
          if (to.params && to.params.key) {
            next();
          } else {
            next({
              name: 'home'
            });
          }
        }
      },
      {
        path: '/faq',
        name: 'faq',
        component: () => import('@/views/FAQs/FAQs.component.vue'),
      },
      {
        path: '/terms-and-conditons',
        name: 'terms-and-conditions',
        component: () => import('@/views/terms-conditions/terms-conditions.component.vue'),
      },
      {
        path: '/how-it-works',
        name: 'howitwork',
        component: () => import('@/views/how-it-works/how-it-works.component.vue'),
      },
      {
        path: '/bether-manager',
        name: 'bettherAdmin',
        component: () => import('@/views/admin/admin.component.vue'),
        meta: {
          isMetamask: true
        }
      }
    ]
  },
  {
    path: '/coming-soon',
    name: 'coming-soon',
    component: () => import('@/views/coming-soon/coming-soon.component.vue')
  },
  {
    path: '/*',
    redirect: '/'
  }
]

export default AppRouter
