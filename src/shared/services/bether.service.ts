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

      console.log("=================")
      console.log(betherContract)
      console.log(bether)

        observer.onNext(betherContract);
        observer.onCompleted();
    }),

  newOffer: (offerObj: any) => Rx.Observable.create((observer: any) => {
    let id = Web3Vue.toSHA3(offerObj.homeTeam+offerObj.awayTeam+(offerObj.time / 1000))
    BetherContractService.init().subscribe((result: any)=> {
      return bether.offerNewMatch(

      id, offerObj.homeTeam, offerObj.awayTeam,
        offerObj.selectedTeam, (offerObj.time ), offerObj.odds,
        { from: offerObj.account, value: window.web3.toWei(offerObj.stake, 'ether') },
        (err:any, result:any) => {
          if(err) {
            observer.error(err);
            console.log(err);
          } else {
            console.log(result)
            observer.onNext(result);
          }

          observer.onCompleted();
        }
      );
    })

  }),


  oddsDeal:(dealObj: any)  => Rx.Observable.create((observer: any) => {

    BetherContractService.getBettingInfo(dealObj.bettingIdx).subscribe((error:any,result:any)=>{

      console.log(result)
      if(result.status == 0) {
        return bether.deal(dealObj.bettingIdx, {from: dealObj.account, value: dealObj.amount}, (error:any, result:any) => {

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


  updateScore:(dealObj:any)  => Rx.Observable.create((observer: any) => {

  }),


  approveScore:(dealObj:any)  => Rx.Observable.create((observer: any) => {

  }),

  getBettingInfo:(bettingIdx: number) =>  Rx.Observable.create((observer: any) => {

    bether.getBettingInfo.call(bettingIdx, (error:any, result:any) => {
      if(error) {
        observer.error(error);
      } else {
        var index = 0;
        var betting = {'bookmakerAddress': result[index++],
          'bookmakerTeam':result[index++].toNumber(),
          'odds':result[index++].toNumber(),
          'bookmakerAmount':result[index++].toNumber(),
          'settledAmount':result[index++].toNumber(),
          'status':result[index++].toNumber(),
          'punters':[] as string[],
          'punterAmounts': [] as number[]
        } as  any;


        for(var i = 0; i < result[index].length;i++) {
          betting.punters[i] = result[index][i];
          betting.punterAmounts[i] = result[index][i].toNumber();

        }
        observer.onNext(betting);
        observer.onCompleted();
      }
    })
  }),

  getBettingIds: (matchId: any)  => Rx.Observable.create((observer: any) => {
     bether.getBettings.call(matchId, (err: any, result:any)=> {
      var ids = [];
      for(var i =0;i< result.length;i++) {
        ids[i] = result[i].toNumber();
      }
      console.log(ids)
      observer.onNext(ids);
      observer.onCompleted();
    });
  }),

  getBettings: (matchId: any)  => Rx.Observable.create((observer: any) => {

    return BetherContractService.getBettingIds(matchId).subscribe((ids: number[]) => {
      var bettings = [] as any[];
      for(var i =0;i< ids.length;i++) {
        console.log(i)
        BetherContractService.getBettingInfo(ids[i]).subscribe((result:any) => {
          bettings.push(result)
          console.log(result);
        });
      }
      observer.onNext(bettings);
      observer.onCompleted();
    })

  }),

  countBettings: (matchIds: any []) => Rx.Observable.create((observer: any) => {

    bether.countBetStatus(matchIds, (err:any, result:any) => {

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
          console.log(bettingStatus)
          observer.onNext(bettingStatus);
          observer.onCompleted();

    })
  }),

};
//# sourceMappingURL=bether.service.js.map
