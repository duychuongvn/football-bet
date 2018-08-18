import { Module } from 'vuex';
import { RootState } from '@/store/types';
import { FireBaseState } from '@/store/firebase/types';

import { getters } from '@/store/firebase/getters';
import { actions } from '@/store/firebase/actions';
import { mutations } from '@/store/firebase/mutations';

export const state: FireBaseState = {
  firebase: undefined,
  firebaseAdmin: undefined
};

const namespaced: boolean = true;

export const firebase: Module<any, RootState> = {
  namespaced,
  state,
  getters,
  actions,
  mutations
};
