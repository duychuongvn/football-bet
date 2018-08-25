import { ActionTree } from 'vuex';
import { RootState } from '@/store/types';

import { RECEVER_FIXTURES } from '@/store/mutations';

import { IpfsService } from '@/shared/services/ipfs.service';
import { Fixture } from '@/shared/model/fixture'

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
    const _today: Array<Object> = [];
    const _tommorrow: Array<Object> = [];
    const _future: Array<Object> = [];

    const _currentDate = moment();
    const _tommorrowDate = moment().add(1, 'day');
    const _futureDate = moment().add(2, 'day');

    for( let i in fixtures[dataObj.key]) {
      IpfsService.getFixture(fixtures[dataObj.key][i])
        .subscribe((res: any) => {
          if (res.length !== 0) {
            res.map((item: any) => {
              if (item.status !== 'FINISHED') {
                const _betting = new Fixture(item);

                if (moment(item.utcDate, 'YYYY/MM/DD').isSame(_currentDate)) {
                  _today.push(_betting);
                }

                if (moment(item.utcDate, 'YYYY/MM/DD').isSame(_tommorrowDate)) {
                  _tommorrow.push(_betting);
                }

                if (moment(item.utcDate, 'YYYY/MM/DD').isSameOrAfter(_futureDate)) {
                  _future.push(_betting);
                }
              }
            });
          }

          console.log(_future)

          commit(RECEVER_FIXTURES, {
            key: 'TODAY',
            name: dataObj.name,
            bettings: _today
          });
          commit(RECEVER_FIXTURES, {
            key: 'TOMORROW',
            name: dataObj.name,
            bettings: _tommorrow
          });
          commit(RECEVER_FIXTURES, {
            key: 'FUTURE',
            name: dataObj.name,
            bettings: _future
          });
        });
    }
  }
};
