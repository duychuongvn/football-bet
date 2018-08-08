import { GetterTree } from 'vuex';
import { RootState } from '@/store/types';

import { USER_TYPE_OPEN, USER_TYPE_FINISHED } from '@/shared/enums/odds';

export const getters: GetterTree<any, RootState> = {
  sortParent: state => state.sortParent,
  sortChild: state => state.sortChild,
  totalOdds: state => state.totalOdds,
  myOdds: state => state.myOdds,
  oddsCancel: state => state.oddsCancel
};