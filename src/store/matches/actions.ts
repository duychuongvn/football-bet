import { ActionTree } from 'vuex';
import { RootState } from '@/store/types';

import { RECEVER_MATCHES } from '@/store/mutations';

export const actions: ActionTree<any, RootState> = {
  fetchMatch({ commit }, match: any): any {
    commit(RECEVER_MATCHES, match);
  }
};