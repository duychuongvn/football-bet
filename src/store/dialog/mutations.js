import { OPEN_DIALOG, INIT_DATA_DIALOG } from '@/store/mutations';
import { DIALOG_NAME } from '@/shared/enums/dialog';
export const mutations = {
    [OPEN_DIALOG](state, dialogObj) {
        switch (dialogObj.key) {
            case DIALOG_NAME.START_LOADING:
                state.isStartLoading = dialogObj.isOpen;
                break;
            case DIALOG_NAME.ODDS_CANCEL:
                state.isOddsCancel = dialogObj.isOpen;
                break;
            case DIALOG_NAME.INSTALL_METAMASK:
                state.isMetaMask = dialogObj.isOpen;
                break;
            case DIALOG_NAME.STORE_BETTING:
                state.isStoreBetting = dialogObj.isOpen;
                break;
            case DIALOG_NAME.BETTING_SHARING:
                state.isSharingBetting = dialogObj.isOpen;
                break;
        }
        if (!dialogObj.isOpen) {
            state.initData = undefined;
            state.dialogName = '';
        }
        else {
            state.dialogName = dialogObj.name;
        }
    },
    [INIT_DATA_DIALOG](state, initData) {
        state.initData = initData;
    }
};
//# sourceMappingURL=mutations.js.map