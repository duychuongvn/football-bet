import { GetterTree } from 'vuex';
import { RootState } from '@/store/types';

export const getters: GetterTree<any, RootState> = {
  totalBettings: state => state.totalBettings,
  bettings: state => state.bettings,
  countBetting: state => state.countBetting
};