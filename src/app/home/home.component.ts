import {Component, NgZone, OnInit} from '@angular/core';
import {Web3Service, SolobetService, MatchService, JhelperService} from '../../service/service';
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {

  account: any;
  accounts: any;
  match = {matchId: '', homeTeam: '', awayTeam: '', homeGoals: 0, awayGoals: 0, time: 0, status: 0};

  upcommingMatches: any;
  bettings: any;
  amount: 0;

  constructor(private _ngZone: NgZone,
              private  web3Service: Web3Service,
              private  solobetService: SolobetService,
              private matchService: MatchService,
            private _helper: JhelperService) {


    this.onReady();

  }

  initMatches = () => {

    this.fetch()

    this.upcommingMatches = new Array();
    this.matchService.getMatches().subscribe(result => {
      // this.upcommingMatches = result;
      for (let i = 0; i < result.length; i++) {
        let match = result[i];
        let mHash = match.match_hometeam_name + match.match_awayteam_name + match.match_date + match.match_time;

        var matchId = this.web3Service.toSHA3(mHash);
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
        this.solobetService.loadBettings(matchId)
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

  onReady = () => {


    

    // alert("ready")
    this._ngZone.run(() => {
        this.initMatches();
      }
    );
    this.web3Service.getAccounts().subscribe(accs => {
      this.accounts = accs;
      this.account = this.accounts[0];

      // This is run from window:load and ZoneJS is not aware of it we
      // need to use _ngZone.run() so that the UI updates on promise resolution

    }, err => alert(err));
  };

  loadMatches = () => {

    this.solobetService.loadMatches('0x123')
      .subscribe(match => {
        this.match = match;
      }, e => {
        console.log(e);
      });
  };

  loadBettings = (match) => {
    this.solobetService.loadBettings(match.id)
      .subscribe(bettings => {
        match.bettings = bettings;
      }, e => {
        console.log(e);
      });
  };

  deal = (matchId, bettingId) => {
    this.solobetService.deal(this.account, matchId, 0)
      .subscribe(result => {
        this.loadBettings(matchId);
      }, e => {
        console.log(e);
      });

  };

  offer = (match) => {
    this.solobetService.newOffer(this.account, match, 75, 3)
      .subscribe(result => {
        this.loadBettings(match);
      }, e => {
        console.log(e);

      });
  };


  public fetch(): any{
    this._helper.fetchFixtures().subscribe(resp => {
      console.log(resp)
    })
  }

}
