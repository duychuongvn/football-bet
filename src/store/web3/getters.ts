import { GetterTree } from 'vuex';
import { Web3State } from './types';
import { RootState } from '@/store/types';

export const getters: GetterTree<any, RootState> = {
  web3Init(state): Web3State {
    return state
  },
  account: state => state.account,
  isAccount(state): boolean {
    return state.account && state.account.address
  },
  isNetwork: state => state.network && (state.network.networkId === 1 || state.network.networkId === 4447 || state.network.networkId === 4)
};
