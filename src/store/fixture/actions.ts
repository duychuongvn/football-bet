import { ActionTree } from 'vuex';
import { RootState } from '@/store/types';

import { RECEVER_FIXTURES } from '@/store/mutations';

import { IpfsService } from '@/shared/services/ipfs.service';
import { Web3Vue } from '@/shared/services/web3.service';

import { Fixture } from '@/shared/model/fixture';

import * as moment from 'moment';

const fixtures: any = {
  bundesliga: require('@/api/bundesliga_2002.json'),
  england: require('@/api/england_2021.json'),
  laliga: require('@/api/laliga_2014.json'),
  lique: require('@/api/lique_2015.json'),
  serie: require('@/api/serie_2019.json'),
  uefac: require('@/api/uefac1_2001.json'),
}

export const actions: ActionTree<any, RootState> = {
  fetchFixtures({ commit }, dataObj: any): any {
    const _today = [] as any [];
    const _tomorrow= [] as any [];
    const _future= [] as any [];

    const _currentDate = moment().format('YYYY-MM-DD');
    const _tomorrowDate = moment().add(1, 'day').format('YYYY-MM-DD');
    const _futureDate = moment().add(2, 'day').format('YYYY-MM-DD');

    for( let i in fixtures[dataObj.key]) {
      IpfsService.getFixture(fixtures[dataObj.key][i])
        .subscribe((res: any) => {
          if (res.length !== 0) {

            res.map((item: any) => {
              const _betting = new Fixture(item);
              const _betDay = moment(item.utcDate).format('YYYY-MM-DD');
              _betting.matchId = Web3Vue.toSHA3(_betting);

              if (moment(_betDay).isSameOrAfter(_currentDate) && moment(_betDay).isBefore(_tomorrowDate)) {
                _betting.isToDay = true;
                _today.push(_betting);
              }

              if (moment(_betDay).isSameOrBefore(_tomorrowDate) && moment(_betDay).isAfter(_currentDate)) {
                _betting.isTomorrow = true;
                _tomorrow.push(_betting);
              }

              if (moment(_betDay).isSameOrAfter(_futureDate)) {
                _betting.isFuture = true;
                _future.push(_betting);
              }
            });
          }

          commit(RECEVER_FIXTURES, {
            key: 'TODAY',
            name: dataObj.name,
            bettings: _today
          });
          commit(RECEVER_FIXTURES, {
            key: 'TOMORROW',
            name: dataObj.name,
            bettings: _tomorrow
          });
          commit(RECEVER_FIXTURES, {
            key: 'FUTURE',
            name: dataObj.name,
            bettings: _future
          });
        });
    }
  },
  checkInit({ state }, status ) {
    state.isInit = status;
  }
};
