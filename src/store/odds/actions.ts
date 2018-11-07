import { ActionTree } from 'vuex';
import { RootState } from '@/store/types';

import { RECEVER_TOTAL_ODDS, CANCEL_ODDS, FILTER_ODDS } from '@/store/mutations';
import { DIALOG_NAME, DIALOG_CLOSE } from '@/shared/enums/dialog';
import { ODDS_STATUS } from '@/shared/enums/odds';

import { BetherContractService } from '@/shared/services/bether.service';

const _groupByLodash = require('lodash.groupby');
const _uniq = require('lodash.uniq');
const _isEqual = require('lodash.isequal');

export const actions: ActionTree<any, RootState> = {
  totalOdds({ commit, rootGetters }, account: string): any {
    BetherContractService.getUserBets(account)
      .delay(3000)
      .subscribe((res: any) => {
        let _tmpData = [];
        const _oddsGroup = _groupByLodash(res, 'matchId');

        for (let i in _oddsGroup) {
          let _tmpBettings = _oddsGroup[i][0].bettings;
          let _tmpStake: any = +_oddsGroup[i][0].summary.stake;

          _oddsGroup[i].filter((item: any, key: number) => {
            if (key !== 0) {
              _tmpBettings = _tmpBettings.concat(item.bettings);
              _tmpStake = _tmpStake + (+item.summary.stake);
            }
          });

          _tmpData.push({
            bettings: _uniq(_tmpBettings),
            match: _oddsGroup[i][0].match,
            matchId: _oddsGroup[i][0].matchId,
            summary: {
              payoutAvailable: _oddsGroup[i][0].summary.payoutAvailable,
              stake: parseFloat(_tmpStake).toFixed(3)
            },
          });
        }

        _tmpData.filter((item: any, key: any) => {
          const _idxHomeTeam = rootGetters['fixture/competitions'].findIndex((compe: any) => _isEqual(compe.name, item.match.homeTeam));
          const _idxAwayTeam = rootGetters['fixture/competitions'].findIndex((compe: any) => _isEqual(compe.name, item.match.awayTeam));

          item.match.homeTeam = rootGetters['fixture/competitions'][_idxHomeTeam];
          item.match.awayTeam = rootGetters['fixture/competitions'][_idxAwayTeam];

          item.match.id = key;
          item.id = key + 1;
        });

        commit(RECEVER_TOTAL_ODDS, _tmpData);
    }, (error: any) => {
        // TODO: handle error
    });
  },
  oddsByMatchId({ commit, state }): any {
    // state.totalOdds.map((odds: any) => {
    //   // SoloBetService.loadMatchesById(odds.matchId)
    //   //   .subscribe((res: any) => {
    //   //     odds.date = moment(res.time * 1000).format('YYYY/MM/DD HH:mm');
    //   //     odds.date_string = moment(res.time * 1000).format('DD MMM YYYY / HH:mm');
    //   //     odds.awayTeam = res.awayTeam;
    //   //     odds.homeTeam = res.homeTeam;
    //   //     commit(RECEVER_MY_ODDS, odds);
    //   //   })
    // })
  },
  cancelOdds({ commit, dispatch }, oddsObj: any): any {
    BetherContractService.cancelOffer(oddsObj)
      .subscribe((res: any) => {
        commit(CANCEL_ODDS, res);
        dispatch('dialog/openDialog', {
          status: {
            key: DIALOG_NAME.ODDS_CANCEL,
            isOpen: false
          },
          initData: {
            key: DIALOG_CLOSE.ODDS_RELOAD,
            oddsCancel: oddsObj
          }
        }, {root: true});
      }, (errors: any) => {
        // TODO: handle errors
      })
  },
  filterOdds({ commit }, filter: any): any {
    commit(FILTER_ODDS, ODDS_STATUS[filter])
  }
};
