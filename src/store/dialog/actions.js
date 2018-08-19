import { OPEN_DIALOG, INIT_DATA_DIALOG } from '@/store/mutations';
export const actions = {
    openDialog({ commit }, initOpts) {
        commit(OPEN_DIALOG, initOpts);
        if (initOpts.initData) {
            commit(INIT_DATA_DIALOG, initOpts.initData);
        }
    },
    setInitData({ commit }, initData) {
        commit(INIT_DATA_DIALOG, initData);
    }
};
//# sourceMappingURL=actions.js.map