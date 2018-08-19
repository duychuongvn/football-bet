import {Web3Vue} from '@/shared/services/web3.service'
import ENV from '@/environment/index'
import {error} from 'util';
let contract = require('truffle-contract')
let betherContractABI = require('@/assets/contracts/BetherContractABI.json')
const Rx = require('rx')
let betherContract : any;
let bether: any;

declare const window: any
export const BetherContractService = {
    init: () => Rx.Observable.create((observer : any) => {

      const betherContract = window.web3.eth.contract(betherContractABI);
      bether = betherContract.at(ENV.CONTRACT_ADDRESS);
        observer.onNext(bether);
        observer.onCompleted();
    }),

  newOffer: (offerObj: any) => Rx.Observable.create((observer: any) => {
    let id = Web3Vue.toSHA3(offerObj.bettingId)
    console.log(id);
    console.log(offerObj)
    bether.offerNewMatch(
      id,
      offerObj.homeTeam, offerObj.awayTeam,
      offerObj.bookmakerTeam, offerObj.time/1000, offerObj.odds,
      { from: offerObj.account, value: window.web3.toWei(offerObj.stake, 'ether') },
        (err:any, result:any) => {
          if(err) {
            observer.error(err);
          } else {
            observer.onNext(result);
          }
          observer.onCompleted();
        }
      );

  }),


  oddsDeal:(dealObj: any)  => Rx.Observable.create((observer: any) => {

    BetherContractService.getBettingInfo(dealObj.bettingId).subscribe((result:any)=>{

      if((result.status === 0 || result.status === 1) && (result.bookmakerAmount - result.settledAmount >= dealObj.amount)) {
        console.log(dealObj.bettingId)
        bether.deal(dealObj.bettingId, {from: dealObj.account, value: window.web3.toWei(dealObj.amount,  'ether')}, (error:any, result:any) => {

          console.log(error);
          console.log(result);

          if(error) {
            observer.error(error);
          } else {
            observer.onNext(result);
            observer.onCompleted();
          }
        })
      } else {
        throw "Betting not valid"
      }

    })


  }),


  updateScore:(scoreObj:any)  => Rx.Observable.create((observer: any) => {
    let id = Web3Vue.toSHA3(scoreObj.bettingId)
    bether.approveScore(id,scoreObj.homeScore, scoreObj.awayScore, {from: scoreObj.account}, (err:any, result:any)=> {
      observer.onCompleted();
    })
  }),


  approveScore:(dealObj:any)  => Rx.Observable.create((observer: any) => {
    let id = Web3Vue.toSHA3(dealObj.bettingId)
    bether.approveScore(id, {from: dealObj.account}, (err:any, result:any)=> {
      observer.onCompleted();
    })
  }),

  getBettingInfo:(bettingIdx: number) =>  Rx.Observable.create((observer: any) => {

    bether.getBettingInfo.call(bettingIdx, (error:any, result:any) => {
      if(error) {
        observer.error(error);
      } else {
        var index = 0;
        var betting = {
          'id': bettingIdx,
          'bettingId': bettingIdx,
          'matchId': null as any,
          'bookmakerAddress': result[index++],
          'bookmakerTeam':result[index++].toNumber(),
          'odds':result[index++].toNumber(),
          'bookmakerAmount':BetherContractService.toEther(result[index++].toNumber()),
          'settledAmount': BetherContractService.toEther(result[index++].toNumber()),
          'status':result[index++].toNumber(),
          'punters':[] as any[]
        } as  any;

        for(var i = 0; i < result[index].length;i++) {
          betting.punters.push({"no": i+1, 'wallet': result[index][i], 'settledAmount':BetherContractService.toEther(result[index+1][i].toNumber()) })
        }

        bether.getMatchId.call(betting.bettingId, (err:any, result:any) => {
          betting.matchId = result;
          observer.onNext(betting);
          observer.onCompleted();
        })

      }
    })
  }),

  getBettingIds: (matchId: any)  => Rx.Observable.create((observer: any) => {
     bether.getBettings.call(matchId, (err: any, result:any)=> {
      let ids = [];
      if (result && result.length !== 0) {
        for(let i = 0; i< result.length; i++) {
          ids[i] = result[i].toNumber();
        }
      }
      observer.onNext(ids);
      observer.onCompleted();
    });
  }),

  getBettings: (matchId: any)  => Rx.Observable.create((observer: any) => {
    let id = Web3Vue.toSHA3(matchId)
    BetherContractService.getBettingIds(id).subscribe((ids: number[]) => {
      let bettings: any = [];
      if (ids && ids.length !== 0) {
        for(let i =0; i< ids.length; i++) {
          BetherContractService.getBettingInfo(ids[i]).subscribe((result:any) => {
            bettings.push(result)
          });
        }
      }
      observer.onNext(bettings);
      observer.onCompleted();
    })

  }),

  countBettings: (matchIds: any []) => Rx.Observable.create((observer: any) => {

    bether.countBetStatus.call(matchIds, (err:any, result:any) => {

          var bettingStatus = [];
          for(var i =0; i< matchIds.length;i++) {
            bettingStatus.push({
              "matchId": matchIds[i],
              "open": result[0][i].toNumber(),
               "portionSettled": result[1][i].toNumber(),
               "settledOrDone": result[2][i].toNumber(),
               "canceled": result[3][i].toNumber(),
               "refuned": result[4][i].toNumber(),
              })
          }
          observer.onNext(bettingStatus);
          observer.onCompleted();

    })
  }),

   cacheBetting(bettings: any[], betting: any) {
      console.log(bettings)
      console.log(betting)
      var match: any;
      for(var i=0;i<bettings.length;i++) {
        if(bettings[i].matchId === betting.matchId) {
          match = bettings[i];
          break;
        }
      }

      if(!match) {
        match= {"matchId": betting.matchId, "bettings": [] as any}
        bettings.push(match);
      }

      var bettingItem: any;
      for(var i=0;i<match.bettings.length;i++) {
        if(match.bettings[i].bettingId === betting.bettingId) {
          bettingItem = match.bettings[i];
          break;
        }
      }

      if(!bettingItem) {
        bettingItem = {"bettingId": betting.bettingId,
          'bookmakerAddress': betting.bookmakerAddress,
          'bookmakerTeam': betting.bookmakerTeam,
          'odds':betting.odds,
          'bookmakerAmount':betting.bookmakerAmount,
          'settledAmount': betting.settledAmount,
          'status':betting.status,
          'punters': [] as any
        }
        match.bettings.push(bettingItem);
      }


        bettingItem.punters.push(...betting.punters)

     return bettings;

  },
  getUserBets : (account : any) => Rx.Observable.create((observe: any) =>{

    bether.getUserBets.call(account, (err:any, bettingIds: any) => {
      var bettings = [] as any[];
        for(var i = 0;i<bettingIds.length;i++) {
          BetherContractService.getBettingInfo(bettingIds[i]).subscribe((res:any) =>{
            BetherContractService.cacheBetting(bettings, res);
          })
        }

        bether.getUserSettles.call(account, (error:any, result:any) => {
          for(var i = 0; i< result[0].length;i++) {
            bether.getSettleInfo.call(result[0][i], result[1][i], (settleInfoErr: any, settleInfoResult: any) => {
              var colIdx = 0;
              var betting = {
                'matchId': settleInfoResult[colIdx++],
                'bettingId': settleInfoResult[colIdx++],
                'bookmakerAddress': settleInfoResult[colIdx++],
                'bookmakerTeam':settleInfoResult[colIdx++].toNumber(),
                'odds':settleInfoResult[colIdx++].toNumber(),
                'bookmakerAmount':BetherContractService.toEther(settleInfoResult[colIdx++].toNumber()),
                'settledAmount': BetherContractService.toEther(settleInfoResult[colIdx++].toNumber()),
                'status':settleInfoResult[colIdx++].toNumber(),
                'punters': [] as any
              } as  any;

              betting.punters.push({  'wallet': settleInfoResult[colIdx++],
                'settledAmount':BetherContractService.toEther(settleInfoResult[colIdx].toNumber()) })
              BetherContractService.cacheBetting(bettings, betting)
            })
          }
          observe.onNext(bettings)
          observe.onCompleted();
        })


    })
  }),

  getVolume: (time: number) => Rx.Observable.create((observe: any)=> {
      bether.getVolume.call(time, (err:any, result: any) => {
        if(err) {
          observe.error(err)
        } else {
          observe.onNext(result.toNumber())
        }

        observe.onCompleted();
      })

    }),

  toEther(wei: number) {
    return window.web3.fromWei(wei, 'ether')
  }
};
//# sourceMappingURL=bether.service.js.map