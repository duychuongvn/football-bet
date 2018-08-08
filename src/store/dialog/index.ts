import { Module } from 'vuex';
import { RootState } from '@/store/types';
import { DialogState } from '@/store/dialog/types';

import { getters } from '@/store/dialog/getters';
import { actions } from '@/store/dialog/actions';
import { mutations } from '@/store/dialog/mutations';

export const state: DialogState = {
  isStartLoading: true,
  isHowItWork: false,
  isOddsCancel: false,
  isMetaMask: false,
  isStoreBetting: false,
  isSharingBetting: false,
  initData: undefined,
  dialogName: 'dialog-start-loading'
};

const namespaced: boolean = true;

export const dialog: Module<any, RootState> = {
  namespaced,
  state,
  getters,
  actions,
  mutations
};