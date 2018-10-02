import { GetterTree } from 'vuex';
import { RootState } from '@/store/types';

export const getters: GetterTree<any, RootState> = {
  bettings: state => state.bettings,
  countBetting: state => state.countBetting,
  loadingBetting: state => state.loadingBetting
};
