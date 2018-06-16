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
    this.fetchScore(this.upcommingMatches);
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

          console.log(_matchId);
          console.log(match.matchId);
          console.log(_matchId === match.matchId)
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
          console.log("match");
          console.log(match);
          this.upcommingMatches.push(match);
          this.fetchScore(match);
        });
      }
    });
  }

  // onReady = () => {
  //   this.web3Service.getAccounts().subscribe(accs => {
  //     this.accounts = accs;
  //     this.account = this.accounts[0];

  //     // This is run from window:load and ZoneJS is not aware of it we
  //     // need to use _ngZone.run() so that the UI updates on promise resolution
  //     this._ngZone.run(() => {
  //         this.initMatches();
  //       }
  //     );
  //   }, err => alert(err));
  // };

  // initMatches = () => {

  // };
  updateScore = match => {
    this.solobetService.updateScore(
      this.account,
      match.matchId,
      parseInt(match.homeScore),
      parseInt(match.awayScore)
    );
    // this.initMatches();
  };
  approveScore = match => {
    this.solobetService.approveScore(this.account, match.matchId);
    // this.initMatches();
  };
}
