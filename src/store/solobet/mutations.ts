import { MutationTree } from 'vuex';
import { CREATE_OFFER, CREATE_DEAL } from '@/store/mutations';

export const mutations: MutationTree<any> = {
  [CREATE_OFFER](state, newOffer: any) {
    state.newOffer = newOffer
  },
  [CREATE_DEAL](state, newDeal: any) {
    state.newDeal = newDeal
  }
};