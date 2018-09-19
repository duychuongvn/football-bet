import { ActionTree } from 'vuex'
import { RootState } from '@/store/types'
import { INIT_WEB3, RECEVER_WEB3_NETWORK, RECEVER_WEB3_ACCOUNT } from '@/store/mutations'
import { Web3State } from '@/store/web3/types'

import { Web3Vue } from '@/shared/services/web3.service'

export const actions: ActionTree<any, RootState> = {
  registerWeb3({ commit }): any {
    Web3Vue.initWeb3().subscribe((res: Web3State) => {
      commit(INIT_WEB3, res)
    }, (error: any) => {
      console.log(error)
    })
  },
  getNetwork({ commit }): any {
    Web3Vue.network().subscribe((res: any) => {
      commit(RECEVER_WEB3_NETWORK, res)

    }, (error: any) => {
      console.log(error)
    })
  },
  getAccount({ commit, state }): any {
    Web3Vue.account(state.account.address).subscribe((res: any) => {
      commit(RECEVER_WEB3_ACCOUNT, res)
    }, (error: any) => {
      console.log(error)
    })
  }
};
