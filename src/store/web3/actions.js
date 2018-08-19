import { INIT_WEB3, RECEVER_WEB3_NETWORK, RECEVER_WEB3_ACCOUNT } from '@/store/mutations';
import { Web3Vue } from '@/shared/services/web3.service';
export const actions = {
    registerWeb3({ commit }) {
        Web3Vue.initWeb3().subscribe((res) => {
            commit(INIT_WEB3, res);
        }, (error) => {
            console.log(error);
        });
    },
    getNetwork({ commit }) {
        Web3Vue.network().subscribe((res) => {
            commit(RECEVER_WEB3_NETWORK, res);
        }, (error) => {
            console.log(error);
        });
    },
    getAccount({ commit, state }) {
        Web3Vue.account(state.account.address).subscribe((res) => {
            commit(RECEVER_WEB3_ACCOUNT, res);
        }, (error) => {
            console.log(error);
        });
    }
};
//# sourceMappingURL=actions.js.map