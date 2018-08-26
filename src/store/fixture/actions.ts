import { ActionTree } from 'vuex';
import { RootState } from '@/store/types';

import { RECEVER_FIXTURES } from '@/store/mutations';

import { IpfsService } from '@/shared/services/ipfs.service';
import { BetherContractService } from '@/shared/services/bether.service';
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
    const _tommorrow= [] as any [];
    const _future= [] as any [];

    const _currentDate = moment().format('YYYY-MM-DD');
    const _tommorrowDate = moment().add(1, 'day').format('YYYY-MM-DD');
    const _futureDate = moment().add(2, 'day').format('YYYY-MM-DD');

    for( let i in fixtures[dataObj.key]) {
      IpfsService.getFixture(fixtures[dataObj.key][i])
        .subscribe((res: any) => {
          if (res.length !== 0) {
            var _todayIds = [] as any[];
            var _tomorrowIds =  [] as  any[];
            var _futureIds = [] as any[];
            res.map((item: any) => {
              if (item.status !== 'FINSIHED') {
                const _betting = new Fixture(item);
                _betting.matchId = Web3Vue.toSHA3(_betting);
                if (moment(item.utcDate, 'YYYY-MM-DD').isSame(_currentDate)) {

                  _today.push(_betting);
                  _todayIds.push(_betting.matchId);
                }

                if (moment(item.utcDate, 'YYYY-MM-DD').isSame(_tommorrowDate)) {
                  _tommorrow.push(_betting);
                  _tomorrowIds.push(_betting.matchId);
                }

                if (moment(item.utcDate, 'YYYY-MM-DD').isSameOrAfter(_futureDate)) {
                  _future.push(_betting);
                  _futureIds.push(_betting.matchId);
                }
              }
            })

              for(var i=0;i<_futureIds.length;i++)
              BetherContractService.countBettings(_futureIds).subscribe((matchInfo: any)=>{

                for (var i=0;i<matchInfo.length;i++) {

                  for(var j=0;j<_future.length;j++) {
                    if(_future[j].matchId == matchInfo[i].matchId) {
                      _future[j].summary = matchInfo[i];
                      console.log(_future[j])
                      break
                    }
                  }
                }
              })

              //console.log(_future)

          }

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
  },
  checkInit({ state }, status ) {
    state.isInit = status;
  }
};
