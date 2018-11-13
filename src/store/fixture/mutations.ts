import { MutationTree } from 'vuex';
import { RECEVER_FIXTURES } from '@/store/mutations';
import { Fixture } from '@/shared/model/fixture';

const orderBy = require('lodash.orderby');

const NAME_LEAGUE: any = {
  bundesliga: 'Bundesliga',
  england: 'Premier League',
  division: 'La Liga',
  lique: 'France Ligue 1',
  serie: 'Serie A',
  uefac: 'UEFA Champions League',
  primeria_liga: 'Primeria Liga',
  eredivisie: 'Eredivisie',
  championship: 'Championship'
}

const COMPETITION_FLAGS: any = {
  bundesliga: require('@/assets/competition-flags/bundesliga-flag.png'),
  england: require('@/assets/competition-flags/premeir-league-flag.png'),
  division: require('@/assets/competition-flags/laliga-flag.png'),
  lique: require('@/assets/competition-flags/france-ligue1-flag.png'),
  serie: require('@/assets/competition-flags/serie-a-flag.png'),
  uefac: require('@/assets/competition-flags/uefa-champions-league-flag.png'),
  primeria_liga: require('@/assets/competition-flags/primeria-liga-flag.png'),
  eredivisie: require('@/assets/competition-flags/eredivisie-flag.png'),
  championship: require('@/assets/competition-flags/championship-flag.png')
}

export const mutations: MutationTree<any> = {
  [RECEVER_FIXTURES](state, fixturesObj: any) {
    for (let i in fixturesObj) {
      state.fixturesToday.push({
        name: NAME_LEAGUE[i],
        flag: COMPETITION_FLAGS[i],
        bettings: orderBy(fixturesObj[i].filter((item: Fixture) => item.isToDay), ['date'], ['asc'])
      });
      state.fixturesTomorrow.push({
        name: NAME_LEAGUE[i],
        flag: COMPETITION_FLAGS[i],
        bettings: orderBy(fixturesObj[i].filter((item: Fixture) => item.isTomorrow), ['date'], ['asc'])
      });
      state.fixturesFuture.push({
        name: NAME_LEAGUE[i],
        flag: COMPETITION_FLAGS[i],
        bettings: orderBy(fixturesObj[i].filter((item: Fixture) => item.isFuture), ['date'], ['asc'])
      });
    }
  }
};
