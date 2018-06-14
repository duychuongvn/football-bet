import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {fromPromise} from 'rxjs/observable/fromPromise';
import {Web3Service} from './web3.service';
import { Betting } from 'models/betting';
import {log} from 'util';

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
          match.homeScore = result[index++].toNumber();
          match.awayScore = result[index++].toNumber();
          match.time = result[index++].toNumber();
          match.status = result[index++].toNumber();

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

  loadMatchById(matchId) {

    this.solobetInstance.findMatch.call(matchId).then(result => {

    });
  }

  loadBettings(matchId): Observable<any> {

    let _matchId = parseInt(matchId);

    let bettings = new Array();
    return Observable.create(observer => {
      this.Solobet.deployed().then(instance => {

        return instance.totalBets.call(_matchId);
      }).then(totalBets => {


        for (let i = 0; i < totalBets; i++) {
          this.getBetting(_matchId, i).subscribe(betting => {
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

  getBetting(matchId, bettingId): Observable<Betting> {

    return Observable.create(observer => {
      this.Solobet.deployed().then(instance => {
        return instance.getBettingInfo.call(matchId, bettingId);
      }).then(result => {
        observer.next(new Betting({
          bettingId: bettingId,
          matchId: matchId,
          amount: result[4].c[0]/10000,
          offer: result[0],
          dealer: result[1],
          odds: result[3].c[0],
          stake: result[4].c[0]/10000,
          status: result[5].toNumber(),
          pair: result[2].toNumber(),homeOffer:"",awayOffer:"",homeDealer:"",awayDealer:""}));
        observer.complete();
      }).catch(err => {
        alert(err);
        observer.error(err);
      });
    });
  }

  deal(account, matchId, bettingId): Observable<any> {
    let _matchId = +matchId;
    let _bettingId = +bettingId;

    console.log(_matchId)
    console.log(_bettingId)

    return Observable.create(observer => {
      this.getBetting(_matchId, _bettingId).subscribe(betting => {
        this.Solobet.deployed().then(instance => {
          return instance.deal(_matchId, _bettingId, {from: account, value: betting.amount});
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

    console.log(account);
    console.log(match);
    console.log(rate);
    console.log(amount);

    var matchTime = new Date(match.matchDate + ' ' + match.matchTime).getTime();

    return Observable.create(observer => {
      this.Solobet.deployed().then(instance => {
        return instance.offerNewMatch(parseInt(match.id), match.homeTeam, match.awayTeam, 0, match.time, rate, {
          from: account,
          value: amount * 1000000000000000000
        });
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
      this.Solobet.deployed().then(instance=>{
        return instance.getPlayerBalance.call(account);
      }).then(balance=>{
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
          bettingMatches.push({
            'matchId': matchIds[i],
            match: null, 'bettingId':
              bettingIds[i].toNumber(),
            'rate': rates[i].toNumber(),
            'amount': this.toEther(amounts[i].toNumber()),
            'chooseHomeTeam': betForHomeTeam[i],
            'betFor': null,
            'status': status[i].toNumber()
          });


        }

        console.log(bettingMatches);
        observe.next(bettingMatches);
        observe.complete();
      });

    });
  }


}
