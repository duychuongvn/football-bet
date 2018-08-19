import { ODDS_STATUS } from '@/shared/enums/odds';
import { RECEVER_TOTAL_ODDS, RECEVER_MY_ODDS, CANCEL_ODDS, FILTER_ODDS } from '@/store/mutations';
export const mutations = {
    [RECEVER_TOTAL_ODDS](state, totalOdds) {
        state.totalOdds = totalOdds;
        state.myOdds = [];
        state.oddsFilter = [];
        state.oddsCancel = undefined;
    },
    [RECEVER_MY_ODDS](state, myOdds) {
        myOdds.bettings.map((betting) => {
            betting.teamSelected = betting.chooseHomeTeam ? myOdds.homeTeam : myOdds.awayTeam;
            betting.isOpen = betting.status === ODDS_STATUS.ODDS_OPEN;
            betting.isSettled = betting.status === ODDS_STATUS.ODDS_SETTLED;
            betting.isCanceled = betting.status === ODDS_STATUS.ODDS_CANCELLED;
            betting.isRefunded = betting.status === ODDS_STATUS.ODDS_REFUNDED;
            betting.isDone = betting.status === ODDS_STATUS.ODDS_DONE;
        });
        state.myOdds.push(myOdds);
    },
    [CANCEL_ODDS](state, oddsCancel) {
        state.oddsCancel = oddsCancel;
    },
    [FILTER_ODDS](state, filter) {
        let _oddsftTemp;
        if (state.originOdds.length === 0) {
            state.originOdds = JSON.parse(JSON.stringify(state.myOdds));
            _oddsftTemp = JSON.parse(JSON.stringify(state.myOdds));
        }
        else {
            _oddsftTemp = JSON.parse(JSON.stringify(state.originOdds));
        }
        _oddsftTemp.filter((odds) => {
            odds.bettings = odds.bettings.filter((betting) => {
                if (filter === undefined) {
                    return betting;
                }
                else {
                    return betting.status === filter;
                }
            });
        });
        state.myOdds = _oddsftTemp;
    }
};
//# sourceMappingURL=mutations.js.map