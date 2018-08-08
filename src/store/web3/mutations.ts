import { MutationTree } from 'vuex';
import { Web3State, Web3Account } from '@/store/web3/types';
import { INIT_WEB3, RECEVER_WEB3_NETWORK, RECEVER_WEB3_ACCOUNT } from '@/store/mutations';

export const mutations: MutationTree<any> = {
  [INIT_WEB3](state: Web3State, initWeb3: Web3State) {
    state.web3 = initWeb3.web3;
    state.injectedWeb3 = initWeb3.injectedWeb3;
  },
  [RECEVER_WEB3_NETWORK](state: Web3State, web3Network: Web3Account) {
    state.account = web3Network
    state.account.avatar = require('@/assets/images/metamask-logo.png')
  },
  [RECEVER_WEB3_ACCOUNT](state: Web3State, web3Account: Web3Account) {
    state.account = Object.assign({}, state.account, web3Account)
  }
};