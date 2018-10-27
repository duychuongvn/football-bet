import { ActionTree } from 'vuex';
import { RootState } from '@/store/types';

import { RECEVER_TOTAL_ODDS, CANCEL_ODDS, FILTER_ODDS } from '@/store/mutations';
import { DIALOG_NAME, DIALOG_CLOSE } from '@/shared/enums/dialog';
import { ODDS_STATUS } from '@/shared/enums/odds';

import { BetherContractService } from '@/shared/services/bether.service';

export const actions: ActionTree<any, RootState> = {
  totalOdds({ commit }, account: string): any {
    BetherContractService.getUserBets(account)
      .subscribe((res: any) => {
        commit(RECEVER_TOTAL_ODDS, res);
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
