import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {fromPromise} from 'rxjs/observable/fromPromise';
import {Web3Service} from './web3.service';
import {Betting} from 'models/betting';
import {log} from 'util';
import { Match } from 'models/match';

declare var require: any;
const solobetArtifacts = require('../../build/contracts/AsianSoloBet.json');
const contract = require('truffle-contract');

@Injectable()
export class SolobetService {

  Solobet = contract(solobetArtifacts);

  solobetInstance: any;

  constructor(
    private web3Ser: Web3Service,
  ) {
    this.Solobet.setProvider(web3Ser.web3.currentProvider);
    this.Solobet.deployed().then(instance => {
      this.solobetInstance = instance;
    });
  }


  loadMatches(matchId): Observable<any> {

    return Observable.create(observer => {

      var match = new Match();
      this.Solobet
        .deployed()
        .then(instance => {

          return instance.findMatch.call(matchId);
        })
        .then((result) => {
          var index = 0;
          match.matchId = matchId;
          match.homeTeam = result[index++];
          match.awayTeam = result[index++];
          match.homeGoals = result[index++].toNumber();
          match.awayGoals = result[index++].toNumber();
          match.time = result[index++].toNumber();
          match.status = result[index++].toNumber();
          match.approved =result[index++]

          if (match.status === 1) {
            let currentime = new Date().getTime() / 1000;
            if (currentime > match.time && currentime < match.time + 100 * 60) {
              match.status = 2;
            }
          }
          observer.next(match);
          observer.complete();


        })
        .catch(e => {
          observer.error(e);
        });
    });

  }

  loadMatchById(matchId) {

    this.solobetInstance.findMatch.call(matchId).then(result => {

    });
  }

  loadBettings(matchId): Observable<any> {

    let bettings = new Array();
    return Observable.create(observer => {
      this.Solobet.deployed().then(instance => {
        return instance.totalBets.call(matchId);
      }).then(totalBets => {
        for (let i = 0; i < totalBets; i++) {
          this.getBetting(matchId, i).subscribe(betting => {
            bettings.push(betting);
          });
        }
        observer.next({matchId: matchId, bettings: bettings});
        observer.complete();
      }).catch(err => {
        observer.error(err);
      });
    });
  }

  getBetting(matchId, bettingId): Observable<Betting> {

    return Observable.create(observer => {
      this.Solobet.deployed().then(instance => {
        return instance.getBettingInfo.call(matchId, bettingId);
      }).then(result => {

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
        observer.complete();
      }).catch(err => {
        alert(err);
        observer.error(err);
      });
    });
  }

  deal(account, matchId, bettingId): Observable<any> {


    return Observable.create(observer => {
      this.getBetting(matchId, bettingId).subscribe(betting => {
        this.Solobet.deployed().then(instance => {
          return instance.deal(matchId, bettingId, {from: account, value: betting.amount});
        }).then(betResult => {
          observer.next(betResult);
          observer.complete();
        }).catch(err => {
          observer.error(err);
        });

      });
    });
  }


  newOffer(account, match, rate, amount, selectedTeam): Observable<any> {

    return Observable.create(observer => {
      this.Solobet.deployed().then(instance => {
        return instance.offerNewMatch(match.matchId, match.homeTeam, match.awayTeam, selectedTeam, match.time / 1000, rate, {
          from: account,
          value: this.web3Ser.web3.toWei(amount, 'ether')
        });
      }).then(result => {
        observer.next(result);
        observer.complete();
      }).catch(error => {
        observer.error(error);
      });
    });
  }

  updateScore(account, matchId: any, homeScore: number, awayScore: number) {
    this.Solobet.deployed().then(instance => {
      return instance.updateScore(matchId, homeScore, awayScore, {from: account});
    });
  }

  loadBettingMatches(): Observable<any> {
    return Observable.create(observer => {
      this.Solobet.deployed().then(instance => {
        return instance.getBettingMatchIds.call();
      }).then(result => {

        observer.next(result);
        observer.complete();
      }).catch(err => {
        console.log(err);
        alert(err);
      });
    });
  }

  approveScore(account: any, matchId: string | any) {
    this.Solobet.deployed().then(instance => {
      return instance.approveScore(matchId, {from: account});
    });
  }

  toEther(wei) {
    return wei / 1000000000000000000;
  }

  getPlacedBalance(account): Observable<any> {
    return Observable.create(observ => {
      this.Solobet.deployed().then(instance => {
        return instance.getPlayerBalance.call(account);
      }).then(balance => {
        observ.next(this.toEther(balance));
        observ.complete();

      }).catch(err => {
        observ.error(err);
      });
    });
  }

  loadBettingMatchesByAccount(account): Observable<any> {
    let bettingMatches = new Array();
    return Observable.create(observe => {
      this.Solobet.deployed().then(instance => {
        return instance.getBettingMatchesByAddress.call(account);
      }).then(result => {
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
            'status_string': ''
          };
          //Open, Deal, Canceled, Refunded, Done
          console.log('======');
          console.log(_betting);
          if (_betting.status === 0) {
            _betting.status_string = 'Open';
          } else if (_betting.status === 1) {
            _betting.status_string = 'On Goging';
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
        observe.complete();
      });

    });
  }


  cancelBetting(account: any, betting: any) {
    this.Solobet.deployed().then(instance => {
      return instance.cancelOffer(betting.matchId, betting.bettingId, {from: account});
    });
  }
}
