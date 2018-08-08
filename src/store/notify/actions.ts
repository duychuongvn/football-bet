import { ActionTree } from 'vuex';
import { RootState } from '@/store/types';

import { NOTIFY_OPEN, NOTIFY_CLEAR } from '@/store/mutations';

export const actions: ActionTree<any, RootState> = {
  notify ({ commit }, notifyObj: any): void {
    commit(NOTIFY_OPEN, notifyObj)
    commit(NOTIFY_CLEAR)
  }
};