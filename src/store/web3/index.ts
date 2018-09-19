import { Module } from 'vuex';
import { RootState } from '@/store/types';

import { Web3State } from '@/store/web3/types';
import { actions } from '@/store/web3/actions';
import { mutations } from '@/store/web3/mutations';
import { getters } from '@/store/web3/getters';

export const state: Web3State = {
  web3: undefined,
  injectedWeb3: false,
  account: undefined,
  network: undefined,
};

const namespaced: boolean = true;

export const web3: Module<any, RootState> = {
  namespaced,
  state,
  actions,
  mutations,
  getters
};
