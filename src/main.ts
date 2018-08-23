import '@babel/polyfill'
import Vue from 'vue'

import { VueProgressBar, ProgressOpts } from '@/plugins/progress-bar'

import Default from '@/layout/default/default.component.vue'
import router from '@/route'
import { store } from '@/store/index'

const VueClipboard = require('vue-clipboard2')
VueClipboard.config.autoSetContainer = true // add this line

const SocialSharing = require('vue-social-sharing')

import '@/plugins/vuetify'
import '@/registerServiceWorker'
import '@/assets/fontawesome-free/css/all.css'
import '@/styles/index.scss'

import '@/shared/extensions/string';

Vue.config.productionTip = false
Vue.use(VueProgressBar, ProgressOpts)
Vue.use(SocialSharing)
Vue.use(VueClipboard)

Vue.component('image-comp', () => import('@/components/image/image.component.vue'))

new Vue({
  router,
  store,
  render: h => h(Default)
}).$mount('#app')
