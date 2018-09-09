import { Web3Vue } from '@/shared/services/web3.service'
import { Betting } from '@/shared/model/betting'
import ENV from '@/environment/index'
import * as moment from 'moment';

const betherContractABI = require('@/assets/contracts/BetherContractABI.json')

const Rx = require('rx')

let bether: any;

declare const window: any;

export const BetherContractService = {
    init: () => Rx.Observable.create((observer: any) => {

      const betherContract = window.web3.eth.contract(betherContractABI);
      bether = betherContract.at(ENV.CONTRACT_ADDRESS);
        observer.onNext(bether);
        observer.onCompleted();
    }),

  newOffer: (matchId: any, offerObj: any) => Rx.Observable.create((observer: any) => {
    var handicap = offerObj.odds;
    if(handicap % 25 == 0 && handicap / 25 <= 8 && handicap / 25 >= - 8) {
      bether.offerNewMatch(
        matchId,
        offerObj.homeTeam, offerObj.awayTeam,
        offerObj.selectedTeam, offerObj.time, handicap,
        {from: offerObj.account, value: window.web3.toWei(offerObj.stake, 'ether')},
        (err: any, result: any) => {
          if (err) {
            observer.error(err);
          } else {
            observer.onNext(result);
          }
          observer.onCompleted();
        }
      );
    }else {
      throw 'Invalid Handicap'
    }
  }),

  oddsDeal:(dealObj: any)  => Rx.Observable.create((observer: any) => {

    BetherContractService.getBettingInfo(dealObj.bettingId).subscribe((result:any)=>{

      if((result.status === 0 || result.status === 1) && (result.bookmakerAmount - result.settledAmount >= dealObj.amount)) {

        bether.bet(dealObj.bettingId, {from: dealObj.account, value: window.web3.toWei(dealObj.amount,  'ether')}, (error:any, result:any) => {
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
    bether.updateScore(scoreObj.matchId, scoreObj.homeScore, scoreObj.awayScore, {from: scoreObj.account}, (err:any, result:any)=> {
      observer.onCompleted();
    })
  }),


  approveScore:(matchObj:any)  => Rx.Observable.create((observer: any) => {
    bether.approveScore(matchObj.matchId, {from: matchObj.account}, (err:any, result:any)=> {
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
          'bookmakerAmount':BetherContractService.toEther(result[index][0].toNumber()),
          'settledAmount': BetherContractService.toEther(result[index++][1].toNumber()),
          'status':result[index++].toNumber(),
          'bookmakerResult':result[index++].toNumber(),
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
    BetherContractService.getBettingIds(matchId).subscribe((ids: number[]) => {
      let bettings: Betting[] = [];
      if (ids && ids.length !== 0) {
        for(let i =0; i< ids.length; i++) {
          BetherContractService.getBettingInfo(ids[i]).subscribe((result:any) => {
            bettings.push(new Betting(result))
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

      var match: any;

      for(var i=0;i<bettings.length;i++) {
        if(bettings[i].matchId === betting.matchId) {
          match = bettings[i];
          break;
        }
      }

      if(!match) {

        match= {"match": null,"summary": {"stake": 0 as number}, "matchId":  betting.matchId, "bettings": [] as any}

        bettings.push(match);

        BetherContractService.loadMatchesById(match.matchId).subscribe((matchInfo:any)=>{
          match.match = matchInfo;
        })
      }

      var bettingItem: any;
      for(var i=0;i<match.bettings.length;i++) {
        if(match.bettings[i].bettingId === betting.bettingId) {
          bettingItem = match.bettings[i];
          break;
        }
      }

      if(!bettingItem) {
        bettingItem = {
          "id": +betting.bettingId.valueOf(),
          "bettingId": +betting.bettingId.valueOf(),
          'bookmakerAddress': betting.bookmakerAddress,
          'bookmakerTeam': betting.bookmakerTeam,
          'odds':betting.odds,
          'bookmakerAmount':betting.bookmakerAmount,
          'settledAmount': betting.settledAmount,
          'status':betting.status,
          'punters': [] as any
        };

        match.bettings.push(bettingItem);
        match.summary.stake = (parseFloat(match.summary.stake)+ parseFloat(bettingItem.bookmakerAmount)).toFixed(3);
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
          });
        }

        bether.getUserSettles.call(account, (error:any, result:any) => {
          for(var i = 0; i< result[0].length;i++) {
            bether.getSettleInfo.call(result[0][i], result[1][i], (settleInfoErr: any, settleInfoResult: any) => {
              var colIdx = 0;
              var betting = {
                'matchId': settleInfoResult[colIdx++],
                'bettingId': settleInfoResult[colIdx++]+'-'+settleInfoResult[colIdx++],
                'bookmakerAddress': settleInfoResult[colIdx++],
                'bookmakerAmount':BetherContractService.toEther(settleInfoResult[colIdx++].toNumber()),
                'bookmakerTeam':settleInfoResult[colIdx++].toNumber(),
                'odds':settleInfoResult[colIdx++].toNumber(),
                'settledAmount': 0,
                'status':settleInfoResult[colIdx++].toNumber(),
                'bookmakerResult':settleInfoResult[colIdx++].toNumber(),
                'punters': [] as any
              } as  any;

              betting.settledAmount = betting.bookmakerAmount;
              //{None, Win, Draw, WinAHalf, LoseAHalf, Lose}
              if(betting.bookmakerResult=== 1) {
                betting.bookmakerResult = 5;
              } else if(betting.bookmakerResult === 3) {
                betting.bookmakerResult = 4;
              } else if (betting.bookmakerResult === 4) {
                betting.bookmakerResult = 3;
              } else if(betting.bookmakerResult ===5) {
                betting.bookmakerResult = 1;
              }
              BetherContractService.cacheBetting(bettings, betting)
            });
          }
          console.log(bettings);
          observe.onNext(bettings);
          observe.onCompleted();
        });
    });
  }),

  getVolume: (time: number) => Rx.Observable.create((observe: any)=> {
      bether.getVolume.call(time, (err:any, result: any) => {
        if(err) {
          observe.error(err)
        } else {
          observe.onNext(BetherContractService.toEther(result.toNumber()))
        }

        observe.onCompleted();
      })

    }),
  loadMatchesById: (matchId: string) => Rx.Observable.create((observer: any) => {
    let match: any = [];
    bether.findMatch.call(matchId, (err:any,result: any) => {
      let index = 0;
      match.matchId = matchId;
      match.homeTeam = result[index++];
      match.awayTeam = result[index++];
      match.homeGoals = result[index++].toNumber();
      match.awayGoals = result[index++].toNumber();
      match.time = result[index++].toNumber();
      match.timeString = moment(match.time*1000 ).format('MMM DD, YYYY [(]ddd[)] - HH:mm a')
      match.status = result[index++].toNumber();
      match.approved = result[index++];

      if (match.status === 1) {
        let currentime = new Date().getTime() / 1000;
        if (currentime > match.time && currentime < match.time + 100 * 60) {
          match.status = 2;
        }
      }

      observer.onNext(match);
      observer.onCompleted();
    })
  }),

  loadMatches: () => Rx.Observable.create((observer: any) => {
      bether.getMatchIds.call((err:any, matchIds:any)=>{
        let matches = [] as any;
        for(let i = 0; i < matchIds.length; i++) {
           BetherContractService.loadMatchesById(matchIds[i]).subscribe((match:any)=> {
             matches.push(match);
           })
        }
        observer.onNext(matches);
        observer.onCompleted();
      })
  }),

  countUserTotalBet: (account: any) => Rx.Observable.create((observe:any)=> {
    bether.countUserBet.call(account, (err:any, result:any)=> {
      let summary = {"totalBets": BetherContractService.toEther(result[0].toNumber()),
        "totalSettled": BetherContractService.toEther(result[1].toNumber()),
        "currentPlaced": null as any};
      bether.getPlayerBalance.call(account, (error:any, balance: any)=> {
        summary.currentPlaced = BetherContractService.toEther(balance.toNumber());
        observe.onNext(summary);
        observe.onCompleted();
      });
    });
  }),
  toEther(wei: number) {
    return parseFloat(window.web3.fromWei(wei, 'ether')).toFixed(3);
  },

  cancelOffer : (oddsObj: any) => Rx.Observable.create((observe: any)=>{
    console.log(oddsObj)
    bether.cancelOffer(oddsObj.bettingId, {from: oddsObj.account}, (err:any, success:any)=>{
      observe.onNext(success);
      observe.onCompleted();
    })
  }),

  claimStake : (claimStakeObj: any) => Rx.Observable.create((observe: any)=>{
    var bettingIds = [] as any [];
    for(var i=0; i< claimStakeObj.bettings.length;i++) {
      bettingIds.push(claimStakeObj.bettings.length[i].bettingId);
    }

    bether.cancelOffer(claimStakeObj.matchId, bettingIds, {from: claimStakeObj.account}, (err:any, success:any)=>{
      observe.onNext(success);
      observe.onCompleted();
    })
  }),
};
