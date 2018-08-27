import { MutationTree } from 'vuex';
import {CREATE_OFFER, CREATE_DEAL, RECEVER_MATCHES, USER_SUMMARY} from '@/store/mutations';

export const mutations: MutationTree<any> = {
  [CREATE_OFFER](state, newOffer: any) {
    state.newOffer = newOffer
  },
  [CREATE_DEAL](state, newDeal: any) {
    state.newDeal = newDeal
  },
  [RECEVER_MATCHES](state, matches:any) {
    state.matches = matches;
  },
  [USER_SUMMARY](state, userSummary:any) {
    state.userSummary = userSummary;
  }
};
