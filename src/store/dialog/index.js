import { getters } from '@/store/dialog/getters';
import { actions } from '@/store/dialog/actions';
import { mutations } from '@/store/dialog/mutations';
export const state = {
    isStartLoading: true,
    isOddsCancel: false,
    isMetaMask: false,
    isStoreBetting: false,
    isSharingBetting: false,
    initData: undefined,
    dialogName: 'dialog-start-loading'
};
const namespaced = true;
export const dialog = {
    namespaced,
    state,
    getters,
    actions,
    mutations
};
//# sourceMappingURL=index.js.map