import { MutationTree } from 'vuex';
import { RECEVER_MATCHES } from '@/store/mutations';

import { Fixture } from '@/shared/model/fixture'

export const mutations: MutationTree<any> = {
  [RECEVER_MATCHES](state, match: any) {
    state.match = new Fixture(match);
  }
};
