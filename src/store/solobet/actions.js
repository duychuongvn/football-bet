import { CREATE_OFFER, CREATE_DEAL } from '@/store/mutations';
import { BetherContractService } from '@/shared/services/bether.service';
export const actions = {
    initContract({ commit }) {
        BetherContractService.init().subscribe();
    },
    createOffer({ commit }, offerObj) {
        // console.log(offerObj)
        BetherContractService.newOffer(offerObj)
            .subscribe((res) => {
            commit(CREATE_OFFER, res);
        }, (error) => {
            console.log(error);
        });
        // let id = Web3Vue.toSHA3(offerObj.homeTeam+offerObj.awayTeam+(offerObj.time / 1000))
        //  BetherContractService.getBettingIds(id).subscribe((res: any) => {
        //  console.log("============")
        //  console.log(res);
        //  BetherContractService.getBettings(id).subscribe((res: any)=> {
        //    console.log(res)
        //  }),
        //  BetherContractService.countBettings([id]).subscribe((res:any)=> {
        //    console.log(res)
        //  })
        //  });
    },
    createDeal({ commit, dispatch }, dealObj) {
        BetherContractService.oddsDeal(dealObj)
            .subscribe((res) => {
            commit(CREATE_DEAL, res);
            dispatch('betting/acceptBet', dealObj, { root: true });
        }, (error) => {
            console.log(error);
        });
    },
    updateScore({ commit }, scoreObj) {
        BetherContractService.updateScore(scoreObj)
            .subscribe((res) => {
            console.log(res);
        }, (error) => {
            console.log(error);
        });
    },
    approveScore({ commit }, scoreObj) {
        BetherContractService.approveScore(scoreObj)
            .subscribe((res) => {
            console.log(res);
        }, (error) => {
            console.log(error);
        });
    }
};
//# sourceMappingURL=actions.js.map