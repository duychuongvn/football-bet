import { RECEVER_TOTAL_BETTING, ACCEPT_BETTING } from '@/store/mutations';
export const mutations = {
    [RECEVER_TOTAL_BETTING](state, bettingObj) {
        state.bettings = bettingObj.bettings;
        // if (!bettingObj.isLoad) {
        //   state.bettings = [];
        // }
    },
    [ACCEPT_BETTING](state, dealObj) {
        state.bettings.map((betting) => {
            if (betting.bettingId === dealObj.bettingId) {
                betting.dealer = dealObj.account;
                betting.status = 1;
                if (betting.selectedTeam === 0) {
                    betting.awayOffer = dealObj.account;
                }
                else {
                    betting.homeOffer = dealObj.account;
                }
            }
        });
    }
};
//# sourceMappingURL=mutations.js.map