import { ActionTree } from 'vuex';
import { RootState } from '@/store/types';

import { RECEVER_FIXTURES } from '@/store/mutations';
import { Fixture } from '@/shared/model/fixture';
import { FixtureInterface } from '@/shared/interfaces/fixture';
import { BetherContractService } from '@/shared/services/bether.service';
import { Sumary } from '@/shared/model/sumary';

const fixtures: any = {
  england: require('@/../football-data.org/matches/premier_league.json'),
  bundesliga: require('@/../football-data.org/matches/bundesliga.json'),
  division: require('@/../football-data.org/matches/primera_division.json'),
  lique: require('@/../football-data.org/matches/ligue_1.json'),
  serie: require('@/../football-data.org/matches/serie_a.json'),
  uefac: require('@/../football-data.org/matches/uefa_champions_league.json'),
}

export const actions: ActionTree<any, RootState> = {
  fetchFixtures({ commit }): any {
    let _listIds: Array<string> = [];
    for (let i in fixtures) {
      if (fixtures[i].length !== 0) {
        fixtures[i] = fixtures[i].map((item: FixtureInterface) => new Fixture(item));
        _listIds = _listIds.concat(fixtures[i].map((item: Fixture) => item.matchId));
      }
    }

    BetherContractService.countBettings(_listIds).subscribe((matchInfo: any)=>{
      matchInfo.map((match: any) => {
        for (let i in fixtures) {
          const _idx = fixtures[i].findIndex((item: Fixture) => item.matchId === match.matchId);
          if (_idx !== -1) {
            fixtures[i][_idx].summary = new Sumary(match);
          }
        }
      });
    });

    commit(RECEVER_FIXTURES, fixtures);
  },
  checkInit({ state }, status ) {
    state.isInit = status;
  }
};
