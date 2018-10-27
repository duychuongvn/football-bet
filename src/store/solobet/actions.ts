import { ActionTree } from 'vuex';
import { RootState } from '@/store/types';
import { CREATE_OFFER, CREATE_DEAL, INIT_CONTRACT, RECEVER_MATCHES, USER_SUMMARY} from '@/store/mutations';
import { BetherContractService } from '@/shared/services/bether.service'
import { Web3Vue } from '@/shared/services/web3.service'

import { HandicapInterface } from '@/shared/interfaces/handicap';

export const actions: ActionTree<any, RootState> = {
  initContract({ commit }): any {
    BetherContractService.init().subscribe((res: any) => {
      commit(INIT_CONTRACT, res);
    });
  },
  createOffer({ commit }, offerObj: any): any {
    const _matchId = Web3Vue.toSHA3(offerObj.match.toJson);

    BetherContractService.newOffer(_matchId, offerObj)
      .subscribe((res: any) => {
        commit(CREATE_OFFER, res)
      }, (error: any) => { })
  },
  createDeal({ commit, dispatch }, dealObj: any): any {
    BetherContractService.oddsDeal(dealObj)
    .subscribe((res: any) => {
      commit(CREATE_DEAL, res)
      dispatch('betting/acceptBet', dealObj, { root: true })
    }, (error: any) => { })
  },
  updateScore({commit}, scoreObj: any): any {
    BetherContractService.updateScore(scoreObj)
      .subscribe((res: any) => {
        // TODO: handle success
      }, (error: any) => {
        // TODO: handle error
      });
  },
  approveScore({commit}, scoreObj: any): any {
    BetherContractService.approveScore(scoreObj)
      .subscribe((res: any) => {
        // TODO: handle success
      }, (error: any) => {
        // TODO: handle error
      });
  },
  matches({commit}):any {
    BetherContractService.loadMatches().subscribe((matches: any) => {
      commit(RECEVER_MATCHES, matches);
    })
  },
  userSummary({commit}, account: any):any {
    BetherContractService.countUserTotalBet(account).subscribe((summary:any)=> {
      commit(USER_SUMMARY, summary);
    })
  }
};
