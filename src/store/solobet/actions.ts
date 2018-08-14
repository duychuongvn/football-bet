import { ActionTree } from 'vuex';
import { RootState } from '@/store/types';

import { CREATE_OFFER, CREATE_DEAL } from '@/store/mutations';

import { BetherContractService } from '@/shared/services/bether.service'
import {Web3Vue} from '@/shared/services/web3.service';

export const actions: ActionTree<any, RootState> = {
  initContract({ commit }, currentProvider: any): any {
    BetherContractService.init().subscribe();
  },
  createOffer({ commit }, offerObj: any): any {
    // console.log(offerObj)
    // BetherContractService.newOffer(offerObj)
    //   .subscribe((res: any) => {
    //     commit(CREATE_OFFER, res)
    //   }, (error: any) => {
    //     console.log(error)
    //   })
    let id = Web3Vue.toSHA3(offerObj.homeTeam+offerObj.awayTeam+(offerObj.time / 1000))
     BetherContractService.getBettingIds(id).subscribe((res: any) => {
     console.log("============")
     console.log(res);


     BetherContractService.getBettings(id).subscribe((res: any)=> {
       console.log(res)
     }),

     BetherContractService.countBettings([id]).subscribe((res:any)=> {
       console.log(res)
     })

   });

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
