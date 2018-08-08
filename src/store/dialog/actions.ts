import { ActionTree } from 'vuex';
import { RootState } from '@/store/types';
import { OPEN_DIALOG, INIT_DATA_DIALOG } from '@/store/mutations';

export const actions: ActionTree<any, RootState> = {
  openDialog({ commit }, initOpts: any): any {
    commit(OPEN_DIALOG, initOpts);
    if (initOpts.initData) {
      commit(INIT_DATA_DIALOG, initOpts.initData);
    }
  },
  setInitData({ commit }, initData: any): any {
    commit(INIT_DATA_DIALOG, initData);
  }
};