import { RECEVER_MATCHES } from '@/store/mutations';
export const actions = {
    fetchMatch({ commit }, match) {
        commit(RECEVER_MATCHES, match);
    }
};
//# sourceMappingURL=actions.js.map