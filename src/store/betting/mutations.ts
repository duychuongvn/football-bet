import { MutationTree } from 'vuex';
import { RECEVER_TOTAL_BETTING, ACCEPT_BETTING } from '@/store/mutations';

export const mutations: MutationTree<any> = {
  [RECEVER_TOTAL_BETTING](state, bettings: any) {
    state.bettings = bettings;
  },
  [ACCEPT_BETTING](state, dealObj: any) {
    state.bettings.map((betting: any) => {
      if ( betting.bettingId === dealObj.bettingId ) {
        betting.dealer = dealObj.account
        betting.status = 1
        if (betting.selectedTeam === 0) {
          betting.awayOffer = dealObj.account
        } else {
          betting.homeOffer = dealObj.account
        }
      }
    })
  }
};
