import { MutationTree } from 'vuex';
import { RECEVER_TOTAL_BETTING, ACCEPT_BETTING } from '@/store/mutations';

import { Betting } from '@/shared/model/betting';

export const mutations: MutationTree<any> = {
  [RECEVER_TOTAL_BETTING](state, bettings: Betting[]) {
    state.bettings = bettings;
  },
  [ACCEPT_BETTING](state, dealObj: any) {
    state.bettings.map((betting: any) => {
      if ( betting.bettingId === dealObj.bettingId ) {
        betting.dealer = dealObj.account
        betting.status = dealObj.amount === (betting.bookmakerAmount - betting.settledAmount) ? 2 : 1
        if (betting.selectedTeam === 0) {
          betting.awayOffer = dealObj.account
        } else {
          betting.homeOffer = dealObj.account
        }
      }
    })
  }
};
