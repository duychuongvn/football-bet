import { Module } from 'vuex'
import { RootState } from '@/store/types'

import { BettingState } from '@/store/betting/types'

import { getters } from '@/store/betting/getters'
import { actions } from '@/store/betting/actions'
import { mutations } from '@/store/betting/mutations'

export const state: BettingState = {
  totalBettings: undefined,
  betting: undefined,
  bettings: [],
  countBetting: 0
}

const namespaced: boolean = true;

export const betting: Module<any, RootState> = {
  namespaced,
  state,
  getters,
  actions,
  mutations
};