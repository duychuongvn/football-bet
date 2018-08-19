import { INIT_WEB3, RECEVER_WEB3_NETWORK, RECEVER_WEB3_ACCOUNT } from '@/store/mutations';
export const mutations = {
    [INIT_WEB3](state, initWeb3) {
        state.web3 = initWeb3.web3;
        state.injectedWeb3 = initWeb3.injectedWeb3;
    },
    [RECEVER_WEB3_NETWORK](state, web3Network) {
        state.account = web3Network;
        state.account.avatar = require('@/assets/images/metamask-logo.png');
    },
    [RECEVER_WEB3_ACCOUNT](state, web3Account) {
        state.account = Object.assign({}, state.account, web3Account);
    }
};
//# sourceMappingURL=mutations.js.map