import { Module } from 'vuex'
import { RootState } from '@/store/types'

import { SolobetState } from '@/store/solobet/types'

import { getters } from '@/store/solobet/getters'
import { actions } from '@/store/solobet/actions'
import { mutations } from '@/store/solobet/mutations'

export const state: SolobetState = {
  newOffer: undefined,
  newDeal: undefined
}

const namespaced: boolean = true;

export const solobet: Module<any, RootState> = {
  namespaced,
  state,
  getters,
  actions,
  mutations
};