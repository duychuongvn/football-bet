import { Component, NgZone, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { Web3Service, SolobetService, UserService, NotifyService } from 'service/service';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
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

  private _matchId: string;

  public isLoading = false;

  constructor(
    private _ngZone: NgZone,
    private web3Service: Web3Service,
    private solobetService: SolobetService,
    private userService: UserService,
    private _notify: NotifyService,
    private _cd: ChangeDetectorRef
  ) {
    this.onReady();
  }

  onReady = () => {

    this.web3Service.getAccounts()
      .subscribe(accs => {
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
      }, err => {
        this._notify.error(err);
      });
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
    // this.networkSympol = this.web3Service.networkSymbol;
    this.loadPlacedBalance();
  };
  loadPlacedBalance = () => {
    this.solobetService.getPlacedBalance(this.account).subscribe(balance => {
      this.placedBalance = balance;
    });
  };

  loadMyBettingMatches = () => {
    this.isLoading = true;

    this.solobetService.loadBettingMatchesByAccount(this.account).subscribe(result => {
      if (!!result[0]) {
        this.convertBettingToGroupByMatches(result);
        this._matchId = result[0].matchId;
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
                  if (item.status === 4) {
                    this.calculateResult(item, match);
                  } else if (item.status === 3) {
                    item.receivedAmount = item.amount;
                  } else {
                    item.receivedAmount = '-';
                  }
                  if (item.status === 0) {
                    match.openBet++;
                  } else if (item.status === 1) {
                    match.settledBet++;
                  }
                  match.totalBet++;
                  this._cd.markForCheck();
                });
                break;
              }
            }
          });
        }
      }

      this.isLoading = false;
    });
  };

  sortMatches() {
    for (var i = 0; i < this.groupMatches.length - 1; i++) {
      for (var j = i + 1; j < this.groupMatches.length; j++) {
        if (this.groupMatches[i].match.time < this.groupMatches[j].match.time) {
          var temp = this.groupMatches[i];
          this.groupMatches[i] = this.groupMatches[j];
          this.groupMatches[j] = temp;
        }
      }
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
        match = { matchId: betting.matchId, match: {}, bettings: [betting] };
        this.groupMatches.push(match);

      }

    }
  }

  claim = (match) => {
    this.solobetService.claimStake(this.account, match.matchId);
  }

  findMatch(matchId) {
    for (let i = 0; i < this.groupMatches.length; i++) {
      if (this.groupMatches[i].matchId === matchId) {
        return this.groupMatches[i];
      }

    }
    return null;
  }

  public showAccordion(matchId: string) {
    this._matchId = matchId;
  }

  public isShowAccordion(matchId: string) {
    return this._matchId === matchId;
  }
}

