import { ActionTree } from 'vuex';
import { RootState } from '@/store/types';

import { RECEVER_TOTAL_BETTING, ACCEPT_BETTING } from '@/store/mutations';

import { BetherContractService } from '@/shared/services/bether.service'

export const actions: ActionTree<any, RootState> = {
  loadBettings({ commit }, bettingObj: any): any {
    BetherContractService.getBettings(bettingObj.id)
      .subscribe((bettings: any) => {
        commit(RECEVER_TOTAL_BETTING, {
          bettings: bettings,
          isLoad: bettingObj.isLoad
        })
      });
  },
  acceptBet({ commit }, dealObj: any) {
    commit(ACCEPT_BETTING, dealObj)
  },
  clearBetting({ state }) {
    state.bettings = []
  }
};
