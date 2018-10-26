import { MutationTree } from 'vuex';
import { RECEVER_FIXTURES } from '@/store/mutations';
import { Fixture } from '@/shared/model/fixture';

const orderBy = require('lodash/orderBy');

export const mutations: MutationTree<any> = {
  [RECEVER_FIXTURES](state, fixturesObj: any) {
    for (let i in fixturesObj) {
      state.fixturesToday.push({
        name: i,
        bettings: orderBy(fixturesObj[i].filter((item: Fixture) => item.isToDay), ['date'], ['asc'])
      });
      state.fixturesTomorrow.push({
        name: i,
        bettings: orderBy(fixturesObj[i].filter((item: Fixture) => item.isTomorrow), ['date'], ['asc'])
      });
      state.fixturesFuture.push({
        name: i,
        bettings: orderBy(fixturesObj[i].filter((item: Fixture) => item.isFuture), ['date'], ['asc'])
      });
    }
  }
};
