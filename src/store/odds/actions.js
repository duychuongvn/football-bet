import { FILTER_ODDS } from '@/store/mutations';
import { ODDS_STATUS } from '@/shared/enums/odds';
// import { SoloBetService } from '@/shared/services/asian-solobet.service'
import { BetherContractService } from '@/shared/services/bether.service';
export const actions = {
    totalOdds({ commit }, account) {
        let _myodds = [];
        BetherContractService.getUserBets(account).subscribe((res) => {
            // if (!!res.length){
            //   res.map((item: any) => {
            //     let _odds = _myodds.findIndex((odds: any) => odds.matchId === item.matchId);
            //     let _betting: any;
            //
            //     _betting = {
            //       id: item.bettingId,
            //       chooseHomeTeam: item.chooseHomeTeam,
            //       stake: item.amount,
            //       odds: (item.odd / 100),
            //       receivedAmount: item.receivedAmount,
            //       status: item.status,
            //       status_string: item.status_string
            //     }
            //
            //     if (item.odd > 0) {
            //       _betting.odds = `+${_betting.odds}`
            //     }
            //
            //     if (_odds < 0) {
            //       _myodds.push({
            //         matchId: item.matchId,
            //         totalStake: item.amount,
            //         bettings: [_betting]
            //       })
            //     } else {
            //       _myodds[_odds].totalStake += item.amount
            //       _myodds[_odds].bettings.push(_betting)
            //     }
            //   });
            //   commit(RECEVER_TOTAL_ODDS, _myodds);
            // }
            console.log(res);
        }, (error) => {
            console.log(error, 'error');
        });
    },
    oddsByMatchId({ commit, state }) {
        state.totalOdds.map((odds) => {
            // SoloBetService.loadMatchesById(odds.matchId)
            //   .subscribe((res: any) => {
            //     odds.date = moment(res.time * 1000).format('YYYY/MM/DD HH:mm');
            //     odds.date_string = moment(res.time * 1000).format('DD MMM YYYY / HH:mm');
            //     odds.awayTeam = res.awayTeam;
            //     odds.homeTeam = res.homeTeam;
            //     commit(RECEVER_MY_ODDS, odds);
            //   })
        });
    },
    cancelOdds({ commit, dispatch }, oddsObj) {
        // SoloBetService.cancelOdds(oddsObj)
        //   .subscribe((res: any) => {
        //     commit(CANCEL_ODDS, res);
        //     dispatch('dialog/openDialog', {
        //       status: {
        //         key: DIALOG_NAME.ODDS_CANCEL,
        //         isOpen: false
        //       },
        //       initData: {
        //         key: DIALOG_CLOSE.ODDS_RELOAD
        //       }
        //     }, {root: true});
        //   }, (errors: any) => {
        //     console.log(errors);
        //   })
    },
    filterOdds({ commit }, filter) {
        commit(FILTER_ODDS, ODDS_STATUS[filter]);
    }
};
//# sourceMappingURL=actions.js.map