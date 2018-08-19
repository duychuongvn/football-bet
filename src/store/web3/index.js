import { actions } from '@/store/web3/actions';
import { mutations } from '@/store/web3/mutations';
import { getters } from '@/store/web3/getters';
export const state = {
    web3: undefined,
    injectedWeb3: false,
    account: undefined
};
const namespaced = true;
export const web3 = {
    namespaced,
    state,
    actions,
    mutations,
    getters
};
//# sourceMappingURL=index.js.map