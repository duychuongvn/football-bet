import { Component, OnInit } from '@angular/core';

import {
  Web3Service,
  SolobetService,
  JhelperService
} from '../../service/service';

import { Fixture } from 'models/fixture';
import { Match } from 'models/match';
import { Betting } from 'models/betting';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent implements OnInit {
  account: any;
  accounts: any;
  // match = {
  //   matchId: "",
  //   homeTeam: "",
  //   awayTeam: "",
  //   homeGoals: 0,
  //   awayGoals: 0,
  //   time: 0,
  //   status: 0
  // };
  match: Match = new Match();

  upcommingMatches: Match[] = [];
  bettings: Betting[];
  amount: 0;
  rate1: 0;
  rate2: 0;

  ngOnInit() {
    this._getAccounts();
    this.setup();
  }

  constructor(
    private _web3Service: Web3Service,
    private solobetService: SolobetService,
    private _helper: JhelperService
  ) {}

  public fetchScore(match) {
    this._helper.fetchFixtures().subscribe(res => {
      res.fixtures.map(fixture => {
        const _fixture = new Fixture(fixture);
        if (_fixture.isFinished) {
          const _matchId = this._helper.hashId(
            fixture.homeTeamName,
            fixture.awayTeamName,
            fixture.date
          );
          if (_matchId.toString() === match.matchId) {
            match.homeGoals = _fixture.result.goalsHomeTeam;
            match.awayGoals = _fixture.result.goalsAwayTeam;
          }
        }
      });
    });
  }

  private _getAccounts() {
    this._web3Service.getAccounts().subscribe(
      accs => {
        this.account = accs[0];
        this.accounts = accs;
      },
      err => alert(err)
    );
  }

  public setup() {
    this.solobetService.loadBettingMatches().subscribe(result => {
      for (let i = 0; i < result.length; i++) {
        this.solobetService.loadMatches(result[i]).subscribe(match => {
          this.upcommingMatches.push(match);
          this.fetchScore(match);
        });
      }
    });
  }

  public updateScore(match) {
    this.solobetService.updateScore(
      this.account,
      match.matchId,
      match.homeGoals,
      match.awayGoals
    );
    // this.initMatches();
  }
  approveScore = match => {
    this.solobetService.approveScore(this.account, match.matchId);
    // this.initMatches();
  }
}
