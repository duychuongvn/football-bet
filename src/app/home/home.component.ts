import { Component, NgZone, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import {
  Web3Service,
  SolobetService,
  MatchService,
  JhelperService
} from "../../service/service";

import { Fixture } from "models/fixture";
import * as groupBy from 'lodash/groupBy';
import * as clone from 'lodash/clone';
import * as map from 'lodash/map';
import * as includes from 'lodash/includes';

@Component({
  selector: "app-home",
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.css"]
})
export class HomeComponent implements OnInit {
  public account: any;
  public accounts: any;
  public match = {
    matchId: "",
    homeTeam: "",
    awayTeam: "",
    homeGoals: 0,
    awayGoals: 0,
    time: 0,
    status: 0
  };
  public upcommingMatches: any;
  public bettings: any;
  public amount: 0;

  private _fixtures: Fixture[] = [];
  private _matchFixtures = [];
  public matchName: string = '';

  constructor(
    private _ngZone: NgZone,
    private _web3Service: Web3Service,
    private _solobetService: SolobetService,
    private _matchService: MatchService,
    private _helper: JhelperService,
    private _router: Router
  ) {}

  ngOnInit() {
    this._ngZone.run(() => {
      this.initMatches();
    });
    this.fetch();
    // this._getAccounts();
  }

  private _getAccounts() {
    this._web3Service.getAccounts().subscribe(
      accs => {
        this.accounts = accs;
        this.account = this.accounts[0];

        // This is run from window:load and ZoneJS is not aware of it we
        // need to use _ngZone.run() so that the UI updates on promise resolution
      },
      err => alert(err)
    );
  }

  public initMatches() {
    this.upcommingMatches = new Array();
    this._helper.fetchFixtures().subscribe(
      result => {
        // this.upcommingMatches = result;
        for (let i = 0; i < result.length; i++) {
          let match = result[i];
          let mHash =
            match.match_hometeam_name +
            match.match_awayteam_name +
            match.match_date +
            match.match_time;

          var matchId = this._web3Service.toSHA3(mHash);
          var bettingMatch = {
            id: matchId,
            homeTeam: match.match_hometeam_name,
            awayTeam: match.match_awayteam_name,
            matchDate: match.match_date,
            matchTime: match.match_time,
            bettings: []
          };
          this.upcommingMatches.push(bettingMatch);

          // bettingMatch.bettings.push(betting);
          this._solobetService.loadBettings(matchId).subscribe(
            result => {
              for (let j = 0; j < this.upcommingMatches.length; j++) {
                let match = this.upcommingMatches[j];
                if (match.id == result.matchId) {
                  match.bettings = result.bettings;
                  break;
                }
              }
            },
            e => {
              console.log(e);
            }
          );
        }
      },
      fetchMatchErr => {
        alert(fetchMatchErr);

      }
    );
  }

  public loadMatches() {
    this._solobetService.loadMatches("0x123").subscribe(
      match => {
        this.match = match;
      },
      e => {
        console.log(e);
      }
    );
  }

  public loadBettings(match) {
    this._solobetService.loadBettings(match.id).subscribe(
      bettings => {
        match.bettings = bettings;
      },
      e => {
        console.log(e);
      }
    );
  }

  public deal(matchId, bettingId) {
    this._solobetService.deal(this.account, matchId, 0).subscribe(
      result => {
        this.loadBettings(matchId);
      },
      e => {
        console.log(e);
      }
    );
  }

  public offer(match) {
    this._solobetService.newOffer(this.account, match, 75, 3).subscribe(
      result => {
        this.loadBettings(match);
      },
      e => {
        console.log(e);
      }
    );
  }

  public fetch(): any {
    this._fixtures = [];

    this._helper.fetchFixtures().subscribe(
      res => {
        res.fixtures.map(item => {
          if (item.homeTeamName && item.awayTeamName) {
            this._fixtures.push(new Fixture(item));
          }
        });
        this.fetchFlag(this._fixtures);
        this._matchFixtures = map(groupBy(this._fixtures, 'date_string', ['asc']), (value, key) => ({
          key,
          value: [...value]
        }));
      },
      errors => {
        console.log(errors);
      }
    );
  }

  private fetchFlag(fixtures: any): any {
    fixtures.forEach(fixture => {
      this._helper.fetchTeam().subscribe(resp => {
        resp.teams.map(team => {
          this._fixtures.forEach(item => {
            if (item.homeTeamName === team.name) {
              item.homeFlag = team.crestUrl;
            }
            if (item.awayTeamName === team.name) {
              item.awayFlag = team.crestUrl;
            }
          });
        });
      });
    });
  }

  public searchMatch(name: string) {
    let _term;
    if (this.matchName.length > 1) {
      _term = this._matchFixtures.filter(item => {
        return item.value.find(val => includes((val.homeTeamName.toLowerCase() || val.awayTeamName.toLowerCase()), this.matchName.toLowerCase()));
      });
    } else {
      _term = this._matchFixtures;
    }

    return _term;
  }

//   loadWorldcupMatches = () => {
//     this.worldcupMatches = new Array();
//     this.matchService.getWorldcupMatches().subscribe(matches => {
//       let fixtures = matches.fixtures;
//       for (let i = 0; i < fixtures.length; i++) {
//         var match = fixtures[i];
//         this.worldcupMatches.push({
//           homeTeamName: match.homeTeamName, awayTeamName: match.awayTeamName, time: match.date,
//           homeScore: match.result.goalsHomeTeam, awayScore: match.result.goalsAwayTeam,
//           homeTeam: {}, awayTeam: {},
//           homeTeamId: match.homeTeam, awayTeamId: match.awayTeam
//         });

//         this.matchService.getWorldcupTeamInfo(match.homeTeam).subscribe(team => {
//           for (let i = 0; i < this.worldcupMatches.length; i++) {
//             let match = this.worldcupMatches[i];
//             if (match.homeTeamId == team._link.self.href) {
//               match.homeTeam = team;
//             } else if (match.awayTeamId == team._link.seft.href) {
//               match.awayTeam = team;
//             }
//           }
//         });

//       }
//     });
//   };
// >>>>>>> beb65726e374a18e73b95a8a6405beb113936a51
}
