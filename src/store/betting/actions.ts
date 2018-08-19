import { ActionTree } from 'vuex';
import { RootState } from '@/store/types';

import { RECEVER_TOTAL_BETTING, ACCEPT_BETTING } from '@/store/mutations';

import { BetherContractService } from '@/shared/services/bether.service'
import { Web3Vue } from '@/shared/services/web3.service'
import { MatchInterface } from '@/shared/interfaces/match'

export const actions: ActionTree<any, RootState> = {
  loadBettings({ commit }, match: MatchInterface): any {
    const _matchId = Web3Vue.toSHA3(match)
    BetherContractService.getBettings(_matchId)
      .subscribe((bettings: any) => {
        commit(RECEVER_TOTAL_BETTING, bettings)
      });
  },
  acceptBet({ commit }, dealObj: any) {
    commit(ACCEPT_BETTING, dealObj)
  },
  clearBetting({ state }) {
    state.bettings = []
  }
};
