import { getters } from '@/store/notify/getters';
import { actions } from '@/store/notify/actions';
import { mutations } from '@/store/notify/mutations';
export const state = {
    notifyObj: {},
    notifyOpen: false,
    notifyClose: ''
};
const namespaced = true;
export const notify = {
    namespaced,
    state,
    getters,
    actions,
    mutations
};
//# sourceMappingURL=index.js.map