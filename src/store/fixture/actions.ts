import { ActionTree } from 'vuex';
import { RootState } from '@/store/types';

import { RECEVER_FIXTURES } from '@/store/mutations';

import { fixtureService } from '@/shared/services/fixtures.service';

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
      fixtureService.fixtures(fixtures[dataObj.key][i])
        .then((res: any) => {
          if (res.data.length !== 0) {
            res.data.map((item: any) => {
              if (item.status !== 'FINISHED') {

                const _betting = {
                  id: item.id,
                  date: item.utcDate,
                  status: item.status,
                  homeTeam: item.homeTeam.name,
                  homeTeamFlag: '', //require(`@/assets/flag/Flag_of_${betting.homeTeam}.svg`)
                  awayTeam: item.awayTeam.name,
                  awayTeamFlag: '', //require(`@/assets/flag/Flag_of_${betting.homeTeam}.svg`)
                  bettingName: `${item.homeTeam.name} ~ ${item.awayTeam.name}`,
                  key: btoa(JSON.stringify({id: item.id, date: item.utcDate}))
                }

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
          commit(RECEVER_FIXTURES, {
            today: {
              name: dataObj.name,
              bettings: _today
            },
            tommorrow: {
              name: dataObj.name,
              bettings: _tommorrow
            },
            future: {
              name: dataObj.name,
              bettings: _future
            }
          });
        });
    }
  }
};
