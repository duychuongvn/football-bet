import { ActionTree } from 'vuex';
import { RootState } from '@/store/types';

import { CREATE_OFFER, CREATE_DEAL } from '@/store/mutations';

import { SoloBetService } from '@/shared/services/asian-solobet.service'

export const actions: ActionTree<any, RootState> = {
  initContract({ commit }, currentProvider: any): any {
    SoloBetService.init(currentProvider).subscribe();
  },
  createOffer({ commit }, offerObj: any): any {
    SoloBetService.newOffer(offerObj)
      .subscribe((res: any) => {
        commit(CREATE_OFFER, res)
      }, (error: any) => {
        console.log(error)
      })
  },
  createDeal({ commit, dispatch }, dealObj: any): any {
    SoloBetService.oddsDeal(dealObj)
    .subscribe((res: any) => {
      commit(CREATE_DEAL, res)
      dispatch('betting/acceptBet', dealObj, { root: true })
    }, (error: any) => {
      console.log(error)
    })
  },
  updateScore({commit}, scoreObj: any): any {
    SoloBetService.updateScore(scoreObj)
      .subscribe((res: any) => {
        console.log(res)
      }, (error: any) => {
        console.log(error)
      });
  },
  approveScore({commit}, scoreObj: any): any {
    SoloBetService.approveScore(scoreObj)
      .subscribe((res: any) => {
        console.log(res)
      }, (error: any) => {
        console.log(error)
      });
  }
};