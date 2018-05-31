import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {fromPromise} from 'rxjs/observable/fromPromise';
import {Web3Service} from './web3.service';

declare var require: any;
const solobetArtifacts = require('../../build/contracts/SoloBet.json');
const contract = require('truffle-contract');

@Injectable()
export class SolobetService {

  Solobet = contract(solobetArtifacts);

  constructor(
    private web3Ser: Web3Service,
  ) {
    this.Solobet.setProvider(web3Ser.web3.currentProvider);
  }


  loadMatches(matchId): Observable<any> {

    return Observable.create(observer => {

      var match = {matchId: '', homeTeam: '', awayTeam: '', homeGoals: 0, awayGoals: 0, time: 0, status: 0};
      this.Solobet
        .deployed()
        .then(instance => {

          return instance.findMatch.call(matchId, {from: this.web3Ser.coinbase});
        })
        .then((result) => {
          var index = 0;
          match.matchId = matchId;
          match.homeTeam = result[index++];
          match.awayTeam = result[index++];
          match.homeGoals =  result[index++];
          match.awayGoals =  result[index++];
          match.time =   result[index++];
          match.status =  result[index++];

          observer.next(match);
          observer.complete();


        })
        .catch(e => {
          alert(e)
          console.log('------' + e);
          observer.error(e);
        });
    });

  }

  loadBettings(matchId): Observable<any> {

    let bettings = new Array();
    return Observable.create(observer => {
      this.Solobet.deployed().then(instance => {

        return instance.totalBets.call(matchId, {from: this.web3Ser.coinbase});
      }).then(totalBets => {


        for (let i = 0; i < totalBets; i++) {
            this.getBetting( matchId, i).subscribe(betting => {
              bettings.push(betting);
            });
        }
        observer.next(bettings);
        observer.complete();
      }).catch(err => {
        observer.error(err);
      });
    });
  }

  getBetting(matchId, bettingId): Observable<any> {

    return Observable.create(observer => {
      this.Solobet.deployed().then(instance => {

        return instance.getBettingInfo.call(matchId, bettingId, {from: this.web3Ser.coinbase});
      }).then(result => {

        let betting = {offer: result[0], dealer: result[1], rate: result[2], amount: result[3], status: result[4]};
        observer.next(betting);
        observer.complete();
      }).catch(err => {
        observer.error(err);
      });
    });
  }
}
