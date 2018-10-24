import { ActionTree } from 'vuex';
import { RootState } from '@/store/types';

import { RECEVER_FIXTURES } from '@/store/mutations';

import { Web3Vue } from '@/shared/services/web3.service';

import { Fixture } from '@/shared/model/fixture';

import * as moment from 'moment';

const fixtures: any = {
  bundesliga: require('@/../football-data.org/matches/bundesliga.json'),
  england: require('@/../football-data.org/matches/premier_league.json'),
  division: require('@/../football-data.org/matches/primera_division.json'),
  lique: require('@/../football-data.org/matches/ligue_1.json'),
  serie: require('@/../football-data.org/matches/serie_a.json'),
  uefac: require('@/../football-data.org/matches/uefa_champions_league.json'),
}

export const actions: ActionTree<any, RootState> = {
  fetchFixtures({ commit }): any {
    const _today = [] as any [];
    const _tomorrow= [] as any [];
    const _future= [] as any [];

    const _currentDate = moment().format('YYYY-MM-DD');
    const _tomorrowDate = moment().add(1, 'day').format('YYYY-MM-DD');
    const _futureDate = moment().add(2, 'day').format('YYYY-MM-DD');

    for( let i in fixtures) {
      if (fixtures[i].length !== 0) {
        fixtures[i].map((item: any) => {
          const _betting = new Fixture(item);
          const _betDay = moment(item.date).format('YYYY-MM-DD');
          _betting.matchId = Web3Vue.toSHA3(_betting);
          _betting.name = i;

          if (moment(_betDay).isSameOrAfter(_currentDate) && moment(_betDay).isBefore(_tomorrowDate)) {
            const _timeBet = moment(item.utcDate).add(2, 'hours').format('YYYY-MM-DD HH:mm:ss');
            const _currentTime = moment().format('YYYY-MM-DD HH:mm:ss');

            _betting.isToDay = true;
            if (!moment(_timeBet).isSameOrBefore(_currentTime)) {
              _today.push(_betting);
            }
          }

          if (moment(_betDay).isSameOrBefore(_tomorrowDate) && moment(_betDay).isAfter(_currentDate)) {
            _betting.isTomorrow = true;
            _tomorrow.push(_betting);
          }

          if (moment(_betDay).isSameOrAfter(_futureDate)) {
            _betting.isFuture = true;
            _future.push(_betting);
          }

          commit(RECEVER_FIXTURES, {
            key: 'TODAY',
            name: i,
            bettings: _today
          });
          commit(RECEVER_FIXTURES, {
            key: 'TOMORROW',
            name: i,
            bettings: _tomorrow
          });
          commit(RECEVER_FIXTURES, {
            key: 'FUTURE',
            name: i,
            bettings: _future
          });
        });
      }
    }
  },
  checkInit({ state }, status ) {
    state.isInit = status;
  }
};
