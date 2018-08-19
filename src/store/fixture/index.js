import { getters } from '@/store/fixture/getters';
import { actions } from '@/store/fixture/actions';
import { mutations } from '@/store/fixture/mutations';
export const state = {
    fixturesToday: [],
    fixturesTomorrow: [],
    fixturesFuture: []
};
const namespaced = true;
export const fixture = {
    namespaced,
    state,
    getters,
    actions,
    mutations
};
//# sourceMappingURL=index.js.map