import { GetterTree } from 'vuex';
import { RootState } from '@/store/types';

export const getters: GetterTree<any, RootState> = {
  firebase: state => state.firebase,
  firebaseAdmin: state => state.firebaseAdmin
};
