import { ActionTree } from 'vuex';
import { RootState } from '@/store/types';

import { RECEVER_TOTAL_BETTING, ACCEPT_BETTING } from '@/store/mutations';

import { BetherContractService } from '@/shared/services/bether.service'
import { Web3Vue } from '@/shared/services/web3.service'
import { MatchInterface } from '@/shared/interfaces/match'
import { Betting } from "@/shared/model/betting";

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
  },
  getBettingById({ commit, state }, data: any) {
    BetherContractService.getBettingInfo(data.bettingId)
      .subscribe((res: any) => {
        const betIdx = state.bettings.findIndex((betting: Betting) => +betting.bettingId === +res.bettingId);
        res.account = data.account;

        if (betIdx !== -1) {
          state.bettings[betIdx].settledAmount = res.settledAmount
          state.bettings[betIdx].bookmakerResult = res.bookmakerResult
          state.bettings[betIdx].returnedAmount = res.returnedAmount
          state.bettings[betIdx].punters = res.punters
        } else {
          state.bettings.push(res)
        }
        state.loadingBetting = false
      });
  },
  setLoadingBetting({state}, type: boolean) {
    state.loadingBetting = type
  }
};
