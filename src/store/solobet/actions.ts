import { ActionTree } from 'vuex';
import { RootState } from '@/store/types';
import { CREATE_OFFER, CREATE_DEAL } from '@/store/mutations';
import { BetherContractService } from '@/shared/services/bether.service'
import { Web3Vue } from '@/shared/services/web3.service'

import { HandicapInterface } from '@/shared/interfaces/handicap'

export const actions: ActionTree<any, RootState> = {
  initContract(): any {
    BetherContractService.init().subscribe();
  },
  createOffer({ commit }, offerObj: HandicapInterface): any {
    const _matchId = Web3Vue.toSHA3(offerObj.match)
    BetherContractService.newOffer(_matchId, offerObj)
      .subscribe((res: any) => {
        commit(CREATE_OFFER, res)
      }, (error: any) => {
        console.log(error)
      })
  },
  createDeal({ commit, dispatch }, dealObj: any): any {
    BetherContractService.oddsDeal(dealObj)
    .subscribe((res: any) => {
      commit(CREATE_DEAL, res)
      dispatch('betting/acceptBet', dealObj, { root: true })
    }, (error: any) => {
      console.log(error)
    })
  },
  updateScore({commit}, scoreObj: any): any {
    BetherContractService.updateScore(scoreObj)
      .subscribe((res: any) => {
        console.log(res)
      }, (error: any) => {
        console.log(error)
      });
  },
  approveScore({commit}, scoreObj: any): any {
    BetherContractService.approveScore(scoreObj)
      .subscribe((res: any) => {
        console.log(res)
      }, (error: any) => {
        console.log(error)
      });
  }
};
