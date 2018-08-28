import { GetterTree } from 'vuex';
import { RootState } from '@/store/types';

export const getters: GetterTree<any, RootState> = {
  bether: state => state.bether,
  newOffer: state => state.newOffer,
  newDeal: state => state.newDeal,
  matches: state => state.matches,
  userSummary: state => state.userSummary
};
