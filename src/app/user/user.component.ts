import {Component, NgZone, OnInit, Pipe, PipeTransform} from '@angular/core';
import {Web3Service, SolobetService, MatchService, UserService} from '../../service/service';


@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})

export class UserComponent {

  account: any;
  bettingMatches: any;
  accounts: any;
  networkSympol: any;
  groupMatches: any;
  searchMatch: any;
  isDeal: boolean;
  isFinished: boolean;
  isOpening: boolean;
  isRefunded: boolean;
  isCanceled: boolean;
  isUpComing: boolean;
  isPlaying: boolean;
  isDone: true;
  groupMatchesFilter: any;
  accountBalance: any;
  placedBalance: number;

  constructor(private _ngZone: NgZone,
              private  web3Service: Web3Service,
              private  solobetService: SolobetService,
              private matchService: MatchService,
              private userService: UserService) {


    this.onReady();

  }

  onReady = () => {

    this.web3Service.getAccounts().subscribe(accs => {
      this.accounts = accs;
      this.account = this.accounts[0];

      // This is run from window:load and ZoneJS is not aware of it we
      // need to use _ngZone.run() so that the UI updates on promise resolution
      this._ngZone.run(() => {
          this.init();
          this.loadMyBettingMatches();
          this.loadAccountBalance();

        }
      );
    }, err => alert(err));
  };

  init = () => {
    this.searchMatch = '';
    this.isDeal = true;
    this.isUpComing = true;
    this.isPlaying = true;
    this.isFinished = true;
    this.isCanceled = true;
    this.isRefunded = true;
    this.isOpening = true;
    this.isDone = true;
  };

  loadAccountBalance = () => {
    this.userService.getBalance(this.account).subscribe(balance => {
      this.accountBalance = balance;
    });
    this.networkSympol = this.web3Service.networkSymbol;
    this.loadPlacedBalance();
  };
  loadPlacedBalance = () => {
    this.solobetService.getPlacedBalance(this.account).subscribe(balance => {
      this.placedBalance = balance;
    });
  };

  loadMyBettingMatches = () => {
    this.solobetService.loadBettingMatchesByAccount(this.account).subscribe(result => {
      this.convertBettingToGroupByMatches(result);
      for (let i = 0; i < result.length; i++) {
        let matchId = result[i].matchId;
        this.solobetService.loadMatches(matchId).subscribe(match => {
          for (let j = 0; j < result.length; j++) {
            if (this.groupMatches[j].matchId == match.matchId) {
              this.groupMatches[j].match = match;
              let _bettings = this.groupMatches[j].bettings;
              _bettings.map(item => {
                if (item.chooseHomeTeam) {
                  item.betFor = match.homeTeam;
                } else {
                  item.betFor = match.awayTeam;
                }
                if(item.status === 4) {
                  this.calculateResult(item, match);
                } else if(item.status === 3) {
                  item.receivedAmount = item.amount;
                }  else {
                  item.receivedAmount = '-';
                }

             //   this.sortMatches();
              });
              break;
            }
          }
        });

      }

    });
  };

  sortMatches() {
    for (var i = 0; i < this.groupMatches.length ; i++) {
      console.log(this.groupMatches[i].match.time );
    }
    for (var i = 0; i < this.groupMatches.length - 1; i++) {
      for (var j = i + 1; j < this.groupMatches.length; j++) {
        if (this.groupMatches[i].match.time < this.groupMatches[j].match.time) {
          console.log(this.groupMatches[i].match.time + ' - ' + this.groupMatches[j].match.time + '>>')

          var temp = this.groupMatches[i];
          this.groupMatches[i] = this.groupMatches[j];
          this.groupMatches[j] = temp;
          console.log(this.groupMatches[i].match.time + ' - ' + this.groupMatches[j].match.time)
        }
      }
    }
    for (var i = 0; i < this.groupMatches.length ; i++) {
      console.log(this.groupMatches[i].match.time );
    }

  }

  calculateResult(betting, match) {
    let selectedTeamScore;
    let againstTeamScore;

    if (betting.betFor === match.homeTeam) {
      selectedTeamScore = match.homeGoals;
      againstTeamScore = match.awayGoals;

    } else {
      againstTeamScore = match.homeGoals;
      selectedTeamScore = match.awayGoals;
    }
    if (match.status === 4) {
      betting.receivedAmount = this.calculateAmount(selectedTeamScore - againstTeamScore, betting.odds, betting.amount);
    } else {
      betting.receivedAmount = '-';
    }

  }


  /**
   * bet: Germany - Sweden
   * odds: Sweden @ 0.75
   * scores: Germany 1 - 0 Sweden
   * goaldifference = 0 - 1
   */

  public calculateAmount(goaldifference: number, odds: number, amount): number {
    let result = 0;
    if (odds + goaldifference == 0.25) result = amount + amount * 95 / 100 / 2;
    else if (odds + goaldifference == -0.25) result = amount * 95 / 100 / 2;
    else if (odds + goaldifference == 0) result = amount - amount * 5 / 100 / 2;
    else if (odds + goaldifference > 0.25) result = amount + amount * 95 / 100;
    if (odds + goaldifference < -0.25) return 0;

    return +result.toFixed(2);
  }

  cancel = (betting) => {
    if (confirm('Do you want to cancel?')) {
      this.solobetService.cancelBetting(this.account, betting);
    }

  };


  convertBettingToGroupByMatches(bettingMatches) {
    this.groupMatches = new Array();

    for (let i = 0; i < bettingMatches.length; i++) {

      let betting = bettingMatches[i];
      let match = this.findMatch(betting.matchId);

      if (match) {
        match.bettings.push(betting);
      } else {
        match = {matchId: betting.matchId, match: {}, bettings: [betting]};
        this.groupMatches.push(match);

      }

    }
  }

  findMatch(matchId) {
    for (let i = 0; i < this.groupMatches.length; i++) {
      if (this.groupMatches[i].matchId === matchId) {
        return this.groupMatches[i];
      }

    }
    return null;
  }
}

