import { NOTIFY_OPEN, NOTIFY_CLEAR } from '@/store/mutations';
export const actions = {
    notify({ commit }, notifyObj) {
        commit(NOTIFY_OPEN, notifyObj);
        commit(NOTIFY_CLEAR);
    }
};
//# sourceMappingURL=actions.js.map