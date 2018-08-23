import { MutationTree } from 'vuex';
import { RECEVER_MATCHES } from '@/store/mutations';

import { Fixture } from '@/shared/model/fixture'

import * as moment from 'moment';

export const mutations: MutationTree<any> = {
  [RECEVER_MATCHES](state, match: any) {
    state.match = new Fixture(match);
    state.match.date = match.date;
    state.match.homeTeam = match.homeTeam;
    state.match.awayTeam = match.awayTeam;
  }
};
