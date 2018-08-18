import { MutationTree } from 'vuex';
import { INIT_FIREBASE, INIT_FIREBASE_ADMIN } from '@/store/mutations';

export const mutations: MutationTree<any> = {
  [INIT_FIREBASE](state, firebase: any) {
    state.firebase = firebase
  },
  [INIT_FIREBASE_ADMIN](state, fbAdmin: any) {
    state.firebaseAdmin = fbAdmin
  }
};
