import { Component, NgZone, OnInit } from "@angular/core";

import {
  Web3Service,
  SolobetService,
  MatchService,
  JhelperService
} from "../../service/service";
import { log } from "util";
import { Fixture } from "models/fixture";

@Component({
  selector: "app-admin",
  templateUrl: "./admin.component.html",
  styleUrls: ["./admin.component.css"]
})
export class AdminComponent implements OnInit {
  account: any;
  accounts: any;
  match = {
    matchId: "",
    homeTeam: "",
    awayTeam: "",
    homeGoals: 0,
    awayGoals: 0,
    time: 0,
    status: 0
  };
  upcommingMatches: any[];
  bettings: any;
  amount: 0;
  rate1: 0;
  rate2: 0;

  ngOnInit() {
    this._getAccounts();
    this.setup();
  }

  constructor(
    private _ngZone: NgZone,
    private _web3Service: Web3Service,
    private solobetService: SolobetService,
    private matchService: MatchService,
    private _helper: JhelperService
  ) {}

  public fetchScore(match) {
    this._helper.fetchFixtures().subscribe(res => {
      res.fixtures.map(fixture => {
        let _fixture = new Fixture(fixture);
        if (_fixture.isFinished) {
          let _matchId = this._helper.hashId(
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
    this.upcommingMatches = new Array();
    this.solobetService.loadBettingMatches().subscribe(result => {
      for (let i = 0; i < result.length; i++) {
        this.solobetService.loadMatches(result[i]).subscribe(match => {

          console.log(match);
          this.upcommingMatches.push(match);
         // this.fetchScore(match);
        });
      }
    });
  }

  public updateScore(match){
    console.log(match)
    this.solobetService.updateScore(
      this.account,
      match.matchId,
      match.homeScore,
      match.awayScore
    );
    // this.initMatches();
  };
  approveScore = match => {
    this.solobetService.approveScore(this.account, match.matchId);
    // this.initMatches();
  };
}
