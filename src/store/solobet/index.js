import { getters } from '@/store/solobet/getters';
import { actions } from '@/store/solobet/actions';
import { mutations } from '@/store/solobet/mutations';
export const state = {
    newOffer: undefined,
    newDeal: undefined,
    bether: undefined
};
const namespaced = true;
export const solobet = {
    namespaced,
    state,
    getters,
    actions,
    mutations
};
//# sourceMappingURL=index.js.map