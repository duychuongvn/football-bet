import { MutationTree } from 'vuex';
import { NOTIFY_OPEN, NOTIFY_CLEAR } from '@/store/mutations';

import ENV from '@/environment/index.ts'

export const mutations: MutationTree<any> = {
  [NOTIFY_OPEN] (state, notifyObj) {
    state.notifyObj = notifyObj

    state.notifyOpen = true
  },
  [NOTIFY_CLEAR] (state) {
    if (state.notifyClose) {
      clearTimeout(state.notifyClose)
    }

    state.notifyClose = setTimeout(() => {
      state.notifyOpen = false
      state.notifyObj = {}
    }, ENV.NOTIFY.DURATION)
  }
};