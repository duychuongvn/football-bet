import { MutationTree } from 'vuex';
import { FixtureState } from './types';
import { RECEVER_FIXTURES } from '@/store/mutations';

export const mutations: MutationTree<any> = {
  [RECEVER_FIXTURES](state, fixtures: FixtureState[]) {

    fixtures.map((item: any) => {
      item.bettings.map((betting: any) => {
        betting.homeTeamFlag = require(`@/assets/flag/Flag_of_${betting.homeTeam}.svg`);
        betting.awayTeamFlag = require(`@/assets/flag/Flag_of_${betting.awayTeam}.svg`);
        betting.bettingName = `${betting.homeTeam} ~ ${betting.awayTeam}`;
        betting.key = btoa(JSON.stringify({
          homeTeam: betting.homeTeam,
          awayTeam: betting.awayTeam,
          date: betting.date
        }));
      })
    });

    state.fixtures = fixtures;
  }
};