import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {fromPromise} from 'rxjs/observable/fromPromise';
import {Web3Service} from './web3.service';

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

      var match = {matchId: '', homeTeam: '', awayTeam: '', homeScore: 0, awayScore: 0, time: 0, status: 0};
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
          match.homeScore = result[index++];
          match.awayScore = result[index++];
          match.time =    result[index++];
          match.status = result[index++];

          observer.next(match);
          observer.complete();


        })
        .catch(e => {
          alert(e);
          console.log('------' + e);
          observer.error(e);
        });
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
          // bettings.push(this.getBettingSync(matchId, i));
        }



        observer.next({matchId: matchId, bettings: bettings});
       observer.complete();
      }).catch(err => {
        observer.error(err);
      });
    });
  }

  getBetting(matchId, bettingId): Observable<any> {

    return Observable.create(observer => {
      this.Solobet.deployed().then(instance => {

        return instance.getBettingInfo.call(matchId, bettingId);
      }).then(result => {
        let betting = {bettingId: bettingId, matchId: matchId, offer: result[0], dealer: result[1], rate: result[2], amount: result[3], status: result[4]};
        observer.next(betting);
        observer.complete();
      }).catch(err => {
        alert(err)
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
          alert(err);
        });

      });
    });
  }

  newOffer(account, match, rate, amount): Observable<any> {
    var matchTime = new Date(match.matchDate + " " + match.matchTime).getTime();
    return Observable.create(observer => {
      this.Solobet.deployed().then(instance => {
        return instance.offerNewMatch(match.id, match.homeTeam, match.awayTeam, matchTime, rate, {from: account, value: amount * 1000000000000000000, nonce: 10});
      }).then(result => {
         observer.next(result);
         observer.complete();
      }).catch(error => {
        observer.error(error);
      });
    });
  }

  updateScore(account: string, matchId: string, homeScore: number, awayScore: number) {
     this.Solobet.deployed().then(instance => {
       return instance.updateScore(matchId, homeScore, awayScore, {from: account});
     });
  }

  loadBettingMatches() : Observable<any> {
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
}
