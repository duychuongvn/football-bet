import { GetterTree } from 'vuex';
import { RootState } from '@/store/types';

export const getters: GetterTree<any, RootState> = {
  notifyOpen: state => state.notifyOpen,
  notifyObj: state => state.notifyObj
};