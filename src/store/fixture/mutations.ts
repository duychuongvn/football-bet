import { MutationTree } from 'vuex';
import { RECEVER_FIXTURES } from '@/store/mutations';

export const mutations: MutationTree<any> = {
  [RECEVER_FIXTURES](state, fixturesObj: any) {
    const _fixturesToday = {
      name: fixturesObj.today.name,
      bettings: []
    }

    const _todayIndex = state.fixturesToday.findIndex((item: any) => item.name === fixturesObj.today.name);

    if (_todayIndex !== -1) {
      state.fixturesToday[_todayIndex].bettings = fixturesObj.today.bettings
    } else {
      state.fixturesToday.push(_fixturesToday);
    }

    // Get Data Tomorrow
    const _fixturesTomorrow = {
      name: fixturesObj.tommorrow.name,
      bettings: []
    }

    const _tommorrowIndex = state.fixturesTomorrow.findIndex((item: any) => item.name === fixturesObj.tommorrow.name);

    if (_todayIndex !== -1) {
      state.fixturesTomorrow[_tommorrowIndex].bettings = fixturesObj.tommorrow.bettings
    } else {
      state.fixturesTomorrow.push(_fixturesTomorrow);
    }

    // Get Data Future
    const _fixturesFuture = {
      name: fixturesObj.future.name,
      bettings: []
    }

    const _futureIndex = state.fixturesFuture.findIndex((item: any) => item.name === fixturesObj.future.name);

    if (_todayIndex !== -1) {
      state.fixturesFuture[_futureIndex].bettings = fixturesObj.future.bettings
    } else {
      state.fixturesFuture.push(_fixturesFuture);
    }
  }
};
