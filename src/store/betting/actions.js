import { RECEVER_TOTAL_BETTING, ACCEPT_BETTING } from '@/store/mutations';
import { BetherContractService } from '@/shared/services/bether.service';
export const actions = {
    loadBettings({ commit }, bettingObj) {
        BetherContractService.getBettings(bettingObj.id)
            .subscribe((bettings) => {
            commit(RECEVER_TOTAL_BETTING, {
                bettings: bettings,
                isLoad: bettingObj.isLoad
            });
        });
    },
    acceptBet({ commit }, dealObj) {
        commit(ACCEPT_BETTING, dealObj);
    },
    clearBetting({ state }) {
        state.bettings = [];
    }
};
//# sourceMappingURL=actions.js.map