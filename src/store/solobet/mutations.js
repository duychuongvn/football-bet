import { CREATE_OFFER, CREATE_DEAL } from '@/store/mutations';
export const mutations = {
    [CREATE_OFFER](state, newOffer) {
        state.newOffer = newOffer;
    },
    [CREATE_DEAL](state, newDeal) {
        state.newDeal = newDeal;
    }
};
//# sourceMappingURL=mutations.js.map