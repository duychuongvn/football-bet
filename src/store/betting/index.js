import { getters } from '@/store/betting/getters';
import { actions } from '@/store/betting/actions';
import { mutations } from '@/store/betting/mutations';
export const state = {
    betting: undefined,
    bettings: [],
    countBetting: 0
};
const namespaced = true;
export const betting = {
    namespaced,
    state,
    getters,
    actions,
    mutations
};
//# sourceMappingURL=index.js.map