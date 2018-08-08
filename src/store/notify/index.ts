import { Module } from 'vuex'
import { RootState } from '@/store/types'

import { NotifyState } from '@/store/notify/types'

import { getters } from '@/store/notify/getters'
import { actions } from '@/store/notify/actions'
import { mutations } from '@/store/notify/mutations'

export const state: NotifyState = {
  notifyObj: {},
  notifyOpen: false,
  notifyClose: ''
}

const namespaced: boolean = true;

export const notify: Module<any, RootState> = {
  namespaced,
  state,
  getters,
  actions,
  mutations
};