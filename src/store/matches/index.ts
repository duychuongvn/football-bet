import { Module } from 'vuex'
import { RootState } from '@/store/types'

import { MatchesState } from '@/store/matches/types'

import { getters } from '@/store/matches/getters'
import { actions } from '@/store/matches/actions'
import { mutations } from '@/store/matches/mutations'

export const state: MatchesState = {
  match: undefined
}

const namespaced: boolean = true;

export const matches: Module<any, RootState> = {
  namespaced,
  state,
  getters,
  actions,
  mutations
};