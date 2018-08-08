import { MutationTree } from 'vuex';
import { RECEVER_BETTING, RECEVER_TOTAL_BETTING, ACCEPT_BETTING } from '@/store/mutations';

export const mutations: MutationTree<any> = {
  [RECEVER_TOTAL_BETTING](state, bettingObj: any) {
    state.totalBettings = bettingObj.totalBettings;
    if (!bettingObj.isLoad) {
      state.bettings = [];
    }
  },
  [RECEVER_BETTING](state, bettingObj: any) {
    if (!bettingObj.betting.status) {
      bettingObj.betting.isOwner = bettingObj.betting.offer === bettingObj.account
    }
    state.bettings.push(bettingObj.betting)
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