import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {fromPromise} from 'rxjs/observable/fromPromise';
import {Web3Service} from './web3.service';
import {Betting} from 'models/betting_bk';
import {log} from 'util';
import {Match} from 'models/match';

declare var require: any;
const solobetArtifacts = require('../../build/contracts/AsianSoloBet.json');
const contract = require('truffle-contract');

@Injectable()
export class SolobetService {

 // Solobet = contract(solobetArtifacts);

  Solobet: any;
  constructor(
    private web3Ser: Web3Service,
  ) { }

  public initProvider() {
   const asianSoloBetContract = this.web3Ser.web3.eth.contract([{"constant":true,"inputs":[{"name":"matchId","type":"bytes32"},{"name":"bettingId","type":"uint256"}],"name":"getBettingInfo","outputs":[{"name":"bMaker","type":"address"},{"name":"punter","type":"address"},{"name":"selectedTeam","type":"uint8"},{"name":"odds","type":"int256"},{"name":"amount","type":"uint256"},{"name":"status","type":"uint8"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"matchId","type":"bytes32"}],"name":"findMatch","outputs":[{"name":"homeTeam","type":"string"},{"name":"awayTeam","type":"string"},{"name":"homeScore","type":"uint256"},{"name":"awayScore","type":"uint256"},{"name":"time","type":"uint256"},{"name":"status","type":"uint8"},{"name":"isApproved","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[],"name":"destroyContract","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"matchId","type":"bytes32"},{"name":"homeScore","type":"uint256"},{"name":"awayScore","type":"uint256"}],"name":"updateScore","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"matchId","type":"bytes32"}],"name":"claimStake","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"bettingOwner","type":"address"}],"name":"getBettingMatchesByAddress","outputs":[{"name":"","type":"bytes32[]"},{"name":"","type":"uint256[]"},{"name":"","type":"int256[]"},{"name":"","type":"uint256[]"},{"name":"","type":"bool[]"},{"name":"","type":"uint256[]"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"countPlayers","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"matchId","type":"bytes32"},{"name":"bettingId","type":"uint256"}],"name":"cancelOffer","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"matchId","type":"bytes32"},{"name":"bettingId","type":"uint256"}],"name":"deal","outputs":[{"name":"","type":"bool"}],"payable":true,"stateMutability":"payable","type":"function"},{"constant":false,"inputs":[{"name":"matchId","type":"bytes32"}],"name":"approveScore","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"getTotalBettingMatches","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_feeOwner","type":"address"}],"name":"changeFeeOwner","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"owner","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"feeOwner","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"matchId","type":"bytes32"}],"name":"totalBets","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"getBettingMatchIds","outputs":[{"name":"","type":"bytes32[]"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"player","type":"address"}],"name":"getPlayerBalance","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[],"name":"withDrawFee","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"newOwner","type":"address"}],"name":"transferOwnership","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"matchId","type":"bytes32"},{"name":"homeTeam","type":"string"},{"name":"awayTeam","type":"string"},{"name":"selectedTeam","type":"uint256"},{"name":"time","type":"uint256"},{"name":"odds","type":"int256"}],"name":"offerNewMatch","outputs":[{"name":"","type":"bool"}],"payable":true,"stateMutability":"payable","type":"function"},{"inputs":[],"payable":false,"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":false,"name":"sender","type":"address"},{"indexed":false,"name":"amount","type":"uint256"}],"name":"LogSelfDestruct","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"bMaker","type":"address"},{"indexed":false,"name":"punter","type":"address"},{"indexed":false,"name":"matchId","type":"bytes32"},{"indexed":false,"name":"betingId","type":"uint256"}],"name":"LogDeal","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"previousOwner","type":"address"},{"indexed":true,"name":"newOwner","type":"address"}],"name":"OwnershipTransferred","type":"event"}]);
    this.Solobet = asianSoloBetContract.at('0x35de80acc95c10b9ba02001238fc53e9d550c93b');
    // this.Solobet.setProvider(this.web3Ser.web3.currentProvider);
console.log(this.web3Ser.web3.currentProvider);

    console.log(this.Solobet);
    this.Solobet.getBettingMatchIds((err, result) => {
      console.log(err);
      console.log(result);
    });
    this.Solobet.countPlayers((err, result)=>{
      console.log(err);
      console.log(result.toNumber());
    })
    console.log();

  };


  loadMatches(matchId): Observable<any> {

    return Observable.create(observer => {

      var match = new Match();
      this.Solobet.findMatch.call(matchId, (error, result) => {
          var index = 0;
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
          observer.next(match);
          observer.complete();


        });
    });

  }


  loadBettings(matchId): Observable<any> {

    let bettings = new Array();
    return Observable.create(observer => {
      this.Solobet.totalBets.call(matchId, (err, totalBets) => {
        if(err) {
          observer.error(err);
        } else {
          for (let i = 0; i < totalBets; i++) {
            this.getBetting(matchId, i).subscribe(betting => {
              bettings.push(betting);
            });
          }
          observer.next({matchId: matchId, bettings: bettings});
          }
        observer.complete();
        });

    });
  }

  getBetting(matchId, bettingId): Observable<Betting> {

    return Observable.create(observer => {
      this.Solobet.getBettingInfo.call(matchId, bettingId, (err, result) => {
        if(err) {
          observer.error(err);
        } else {
        let betting = new Betting({
          bettingId: bettingId,
          matchId: matchId,
          offer: result[0],
          dealer: result[1],
          selectedTeam: result[2].toNumber(),
          odds: result[3].toNumber(),
          amount: result[4].toNumber(),
          stake: this.toEther(result[4].toNumber()),
          status: result[5].toNumber(),
          homeOffer: '', awayOffer: '', homeDealer: '', awayDealer: ''
        });
        if (betting.selectedTeam === 0) {
          betting.homeOffer = betting.offer;
          betting.awayOffer = betting.dealer;
        } else {
          betting.homeOffer = betting.dealer;
          betting.awayOffer = betting.offer;
        }

        observer.next(betting);
        }
        observer.complete();
      });
    });
  }

  deal(account, matchId, bettingId): Observable<any> {


    return Observable.create(observer => {
      this.getBetting(matchId, bettingId).subscribe(betting => {
        this.Solobet.deal(matchId, bettingId, {from: account, value: betting.amount}, (err,  betResult) => {
         if(err) {
           observer.error(err);
         } else {
           observer.next(betResult);
         }

          observer.complete();
        });

      });
    });
  }


  newOffer(account, match, rate, amount, selectedTeam): Observable<any> {

    return Observable.create(observer => {
      alert('da')
      this.Solobet.offerNewMatch(match.matchId, match.homeTeam, match.awayTeam, selectedTeam, match.time / 1000, rate, {
          from: account,
          value: this.web3Ser.web3.toWei(amount, 'ether')
        },(err, result) => {

        if(err) {
          alert(err)
          console.log(err);
          observer.next(err);
        } else {
          alert(result);
          observer.next(result);
        }
        observer.complete();
      });
    });
  }

  updateScore(account, matchId: any, homeScore: number, awayScore: number) {
    this.Solobet.updateScore(matchId, homeScore, awayScore, {from: account}, (err, result)=> {
      if(err) {
        console.log(err);
      } else {
        alert("Success");
      }

    });
  }

  loadBettingMatches(): Observable<any> {
    return Observable.create(observer => {
      this.Solobet.getBettingMatchIds.call((err, result) => {
        if(err) {
          console.log(err);
          alert(err);
        } else {
          observer.next(result);
          observer.complete();
        }
      }).then(result => {

        observer.next(result);
        observer.complete();
      });
    });
  }

  approveScore(account: any, matchId: string | any) {
    this.Solobet.approveScore(matchId, {from: account});

  }

  toEther(wei) {
    return wei / 1000000000000000000;
  }

  getPlacedBalance(account): Observable<any> {
    return Observable.create(observ => {
      this.Solobet.getPlayerBalance.call(account, (err, balance)=> {
        if(err) {
          observ.error(err);
        } else {
          observ.next(this.toEther(balance));
          observ.complete();

        }
      });

    });
  }

  loadBettingMatchesByAccount(account): Observable<any> {
    let bettingMatches = new Array();
    return Observable.create(observe => {
      this.Solobet.getBettingMatchesByAddress.call(account, (err, result)=> {
        if (err) {
          observe.error(err);
        } else {
          var matchIds = result[0];
          var bettingIds = result[1];
          var rates = result[2];
          var amounts = result[3];
          var betForHomeTeam = result[4];
          var status = result[5];
          for (let i = 0; i < matchIds.length; i++) {
            let _betting = {
              'matchId': matchIds[i],
              match: null, 'bettingId':
                bettingIds[i].toNumber(),
              'odds': rates[i].toNumber(),
              'amount': this.toEther(amounts[i].toNumber()),
              'chooseHomeTeam': betForHomeTeam[i],
              'betFor': null,
              'status': status[i].toNumber(),
              'status_string': '',
              'receivedAmount': 0
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

          observe.next(bettingMatches);

        }
        observe.complete();
      });

    });
  }


  cancelBetting(account: any, betting: any) {
    this.Solobet.cancelOffer(betting.matchId, betting.bettingId, {from: account},(err, result)=>{});

  }

  claimStake(account: any, matchId: any) {
    this.Solobet.claimStake(matchId, {from: account},(err, result)=>{});

  }
}
