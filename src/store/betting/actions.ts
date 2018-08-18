import { ActionTree } from 'vuex';
import { RootState } from '@/store/types';

import { RECEVER_BETTING, RECEVER_TOTAL_BETTING, ACCEPT_BETTING } from '@/store/mutations';

import { SoloBetService } from '@/shared/services/asian-solobet.service'
import { BetherContractService } from '@/shared/services/bether.service'
import { Web3Vue } from '@/shared/services/web3.service';

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
  getBetting({ commit, state }, bettingObj: any) {
    for (let i = 0; i < state.totalBettings; i++) {
      SoloBetService.getBetting(bettingObj.matchId, i).subscribe((betting: any) => {
        commit(RECEVER_BETTING, {
          account: bettingObj.account,
          betting: betting
        })
      });
    }
  },
  acceptBet({ commit }, dealObj: any) {
    commit(ACCEPT_BETTING, dealObj)
  },
  clearBetting({ state }) {
    state.bettings = []
  }
};
