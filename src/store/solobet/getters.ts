import { GetterTree } from 'vuex';
import { RootState } from '@/store/types';

export const getters: GetterTree<any, RootState> = {
  newOffer: state => state.newOffer,
  newDeal: state => state.newDeal
};