import {web3} from '@/store/web3';
import { Web3Vue } from '@/shared/services/web3.service';

let contract = require('truffle-contract')
let AsianSoloBetContract = require('@/assets/contracts/AsianSoloBet.json')
const Rx = require('rx')

declare const window: any

let soloBetContract: any;

export const SoloBetService = {
  init: (currentProvider: any) => Rx.Observable.create((observer: any) => {
    soloBetContract = contract(AsianSoloBetContract)
    soloBetContract.setProvider(currentProvider)

    console.log(soloBetContract)
    console.log(currentProvider);
    observer.onNext(soloBetContract)
    observer.onCompleted()
  }),
  getBetting: (matchId: string, bettingId: number) => Rx.Observable.create((observer: any) => {

    soloBetContract.deployed()
    .then((instance: any) => {
      return instance.getBettingInfo.call(matchId, bettingId);
    }).then((result: any) => {

      let betting: any = {
        bettingId: bettingId,
        matchId: matchId,
        offer: result[0],
        dealer: result[1],
        selectedTeam: result[2].toNumber(),
        odds: result[3].toNumber(),
        amount: result[4].toNumber(),
        stake: SoloBetService.toEther(result[4].toNumber()),
        status: result[5].toNumber(),
      }

      if (betting.selectedTeam === 0) {
        betting.homeOffer = betting.offer;
        betting.awayOffer = betting.dealer;
      } else {
        betting.homeOffer = betting.dealer;
        betting.awayOffer = betting.offer;
      }

      observer.onNext(betting);
      observer.onCompleted();
    }).catch((err: any) => {
      observer.error(err);
    });
  }),
  newOffer: (offerObj: any) => Rx.Observable.create((observer: any) => {

    console.log(offerObj);
    let stake = window.web3.toWei(offerObj.stake, 'ether');
    console.log(stake);
    let matchId = Web3Vue.toSHA3(offerObj.homeTeam+offerObj.awayTeam+ (offerObj.time / 1000));
    console.log(matchId);window.web3.toWei(offerObj.stake, 'ether')
    soloBetContract.deployed().then((instance: any) => {
      return instance.offerNewMatch(
        matchId, offerObj.homeTeam, offerObj.awayTeam,
        offerObj.selectedTeam, (offerObj.time / 1000), offerObj.odds,
        { from: offerObj.account, value:  stake}
      );
    }).then((result: any) => {
      observer.onNext(result);
      observer.onCompleted();
    }).catch((error: any) => {
      observer.error(error);
    });
  }),
  loadMatchesById: (matchId: string) => Rx.Observable.create((observer: any) => {
    let match: any = [];
    soloBetContract.deployed().then((instance: any) => {
      return instance.findMatch.call(matchId);
    }).then((result: any) => {
        let index = 0;
        match.matchId = matchId;
        match.homeTeam = result[index++];
        match.awayTeam = result[index++];
        match.homeGoals = result[index++].toNumber();
        match.awayGoals = result[index++].toNumber();
        match.time = result[index++].toNumber();
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
      .catch((e: any) => {
        observer.error(e);
      });
  }),
  loadBettings: (matchId: string) => Rx.Observable.create((observer: any) => {
    soloBetContract.deployed().then((instance: any) => {
      return instance.totalBets.call(matchId);
    }).then((totalBets: any) => {
      observer.onNext(totalBets);
      observer.onCompleted();
    }).catch((err: any) => {
      observer.error(err);
    });
  }),
  loadBettingsByAccount: (account: string) => Rx.Observable.create((observer: any) => {
    let bettingMatches: Array<Object> = [];

    soloBetContract.deployed().then((instance: any) => {
      return instance.getBettingMatchesByAddress.call(account);
    }).then((result: any) => {

      let matchIds       = result[0];
      let bettingIds     = result[1];
      let rates          = result[2];
      let amounts        = result[3];
      let betForHomeTeam = result[4];
      let status         = result[5];

      for (let i = 0; i < matchIds.length; i++) {

        let _betting = {
          matchId: matchIds[i],
          match: null,
          bettingId: bettingIds[i].toNumber(),
          odd: rates[i].toNumber(),
          amount: SoloBetService.toEther(amounts[i].toNumber()),
          chooseHomeTeam: betForHomeTeam[i],
          betFor: null,
          status: status[i].toNumber(),
          status_string: '',
          receivedAmount: 0
        };

        //Open, Deal, Canceled, Refunded, Done
        if (_betting.status === 0) {
          _betting.status_string = 'Open';
        } else if (_betting.status === 1) {
          _betting.status_string = 'Settled';
        } else if (_betting.status === 2) {
          _betting.status_string = 'Canceled';
        } else if (_betting.status === 3) {
          _betting.status_string = 'Refunded';
        } else if (_betting.status === 4) {
          _betting.status_string = 'Done';
        }
        bettingMatches.push(_betting);
      }

      observer.onNext(bettingMatches);
      observer.onCompleted();
    });
  }),
  oddsDeal: (dealObj: any) => Rx.Observable.create((observer: any) => {
    soloBetContract.deployed().then((instance : any) => {
      return instance.deal(dealObj.matchId, dealObj.bettingId, {from: dealObj.account, value: dealObj.amount});
    }).then((betResult: any) => {
      observer.onNext(betResult);
      observer.onCompleted();
    }).catch((err: any) => {
      observer.error(err);
    });
  }),
  cancelOdds: (oddsObj: any) => Rx.Observable.create((observer: any) => {
    soloBetContract.deployed()
      .then((instance: any) => {
        return instance.cancelOffer(oddsObj.matchId, oddsObj.bettingId, {from: oddsObj.account});
      })
      .then((result: any) => {
        observer.onNext(result);
        observer.onCompleted();
      }).catch((err: any) => {
        observer.error(err);
      });
  }),
  updateScore: (scoreObj: any) => Rx.Observable.create((observer: any) => {
    soloBetContract.deployed().then((instance: any) => {
      return instance.updateScore(scoreObj.matchId, scoreObj.homeScore, scoreObj.awayScore, {from: scoreObj.account});
    })
    .then((result: any) => {
      observer.onNext(result);
      observer.onCompleted();
    }).catch((err: any) => {
      observer.error(err);
    });
  }),
  approveScore: (scoreObj: any) => Rx.Observable.create((observer: any) => {
    soloBetContract.deployed().then((instance: any) => {
      return instance.approveScore(scoreObj.matchId, {from: scoreObj.account});
    })
    .then((result: any) => {
      observer.onNext(result);
      observer.onCompleted();
    }).catch((err: any) => {
      observer.error(err);
    });
  }),
  toEther(wei: number) {
    return wei / 1000000000000000000;
  }
}
