import {Component, NgZone, OnInit} from '@angular/core';
import { Web3Service, SolobetService, MatchService, JhelperService } from 'service/service';

import { Fixture } from 'models/fixture';
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  public account: any;
  public accounts: any;
  public match = {matchId: '', homeTeam: '', awayTeam: '', homeGoals: 0, awayGoals: 0, time: 0, status: 0};

  public upcommingMatches: any;
  public bettings: any;
  public amount: 0;

  public fixtures: Fixture[] = [];

  constructor(
    private _ngZone: NgZone,
    private _web3Service: Web3Service,
    private _solobetService: SolobetService,
    private _matchService: MatchService,
    private _helper: JhelperService
  ) { }

  ngOnInit() {
    // this._ngZone.run(() => {
    //     this.initMatches();
    //   }
    // );
    this.fetch();
    // this._getAccounts();
  }

  private _getAccounts() {
    this._web3Service.getAccounts().subscribe(accs => {
      this.accounts = accs;
      this.account = this.accounts[0];

      // This is run from window:load and ZoneJS is not aware of it we
      // need to use _ngZone.run() so that the UI updates on promise resolution

    }, err => alert(err));
  }

  public initMatches () {
    this.upcommingMatches = new Array();
    this._matchService.getMatches().subscribe(result => {
      // this.upcommingMatches = result;
      for (let i = 0; i < result.length; i++) {
        let match = result[i];
        let mHash = match.match_hometeam_name + match.match_awayteam_name + match.match_date + match.match_time;

        var matchId = this._web3Service.toSHA3(mHash);
        var bettingMatch = {
          'id': matchId,
          'homeTeam': match.match_hometeam_name,
          'awayTeam': match.match_awayteam_name,
          'matchDate': match.match_date,
          'matchTime': match.match_time,
          'bettings': []
        };
        this.upcommingMatches.push(bettingMatch);

      // bettingMatch.bettings.push(betting);
        this._solobetService.loadBettings(matchId)
          .subscribe(result => {

            for(let j =0; j < this.upcommingMatches.length;j++ ) {
              let match = this.upcommingMatches[j];
               if(match.id == result.matchId){
                 match.bettings = result.bettings;
                 break;
               }
            }

          }, e => {
            console.log(e);
          });
      }
    }, fetchMatchErr => {
      alert(fetchMatchErr);
    });
  };

  public loadMatches () {

    this._solobetService.loadMatches('0x123')
      .subscribe(match => {
        this.match = match;
      }, e => {
        console.log(e);
      });
  };

  public loadBettings (match) {
    this._solobetService.loadBettings(match.id)
      .subscribe(bettings => {
        match.bettings = bettings;
      }, e => {
        console.log(e);
      });
  };

  public deal (matchId, bettingId) {
    this._solobetService.deal(this.account, matchId, 0)
      .subscribe(result => {
        this.loadBettings(matchId);
      }, e => {
        console.log(e);
      });

  };

  public offer(match) {
    this._solobetService.newOffer(this.account, match, 75, 3)
      .subscribe(result => {
        this.loadBettings(match);
      }, e => {
        console.log(e);

      });
  };

  public fetch(): any{
    this.fixtures = [];

    this._helper.fetchFixtures()
      .subscribe(res => {
        res.fixtures.map(item => {
          if (item.homeTeamName && item.awayTeamName) {
            this.fixtures.push(new Fixture(item))
          }
        });
      }, errors => {
        console.log(errors);
      });
  }

}
