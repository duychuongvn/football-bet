import { getters } from '@/store/matches/getters';
import { actions } from '@/store/matches/actions';
import { mutations } from '@/store/matches/mutations';
export const state = {
    match: undefined
};
const namespaced = true;
export const matches = {
    namespaced,
    state,
    getters,
    actions,
    mutations
};
//# sourceMappingURL=index.js.map