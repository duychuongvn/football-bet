import { GetterTree } from 'vuex';
import { RootState } from '@/store/types';

export const getters: GetterTree<any, RootState> = {
  match: state => state.match
};