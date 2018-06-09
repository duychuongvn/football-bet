import {Component, NgZone, OnInit} from '@angular/core';
import {Web3Service, SolobetService, MatchService} from '../../service/service';
@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent {

  account: any;
  bettingMatches: any;
  accounts: any;

  groupMatches: any;

  constructor(private _ngZone: NgZone,
              private  web3Service: Web3Service,
              private  solobetService: SolobetService,
              private matchService: MatchService) {


    this.onReady();

  }

  onReady = () => {

    this.web3Service.getAccounts().subscribe(accs => {
      this.accounts = accs;
      this.account = this.accounts[0];

      // This is run from window:load and ZoneJS is not aware of it we
      // need to use _ngZone.run() so that the UI updates on promise resolution
      this._ngZone.run(() => {
          this.loadMyBettingMatches();
        }
      );
    }, err => alert(err));
  }

  loadMyBettingMatches = () => {
    this.solobetService.loadBettingMatchesByAccount(this.account).subscribe(result => {
      this.convertBettingToGroupByMatches(result);
       for(let i =0;i<result.length;i++) {
         let matchId = result[i].matchId;
         this.solobetService.loadMatches(matchId).subscribe(match => {
           for(let j =0 ;j<result.length;j++) {
             if(this.groupMatches[j].matchId == match.matchId) {
               this.groupMatches[j].match = match;
              break;
             }
           }
         });

       }

       console.log(this.groupMatches);

    });
  }

  convertBettingToGroupByMatches(bettingMatches) {
    this.groupMatches = new Array();

    for(let i = 0; i < bettingMatches.length;i++) {

      let betting = bettingMatches[i];
      let match = this.findMatch(betting.matchId) ;

      if(match) {
        match.bettings.push(betting);
      } else {
        match = {matchId: betting.matchId, match: {}, bettings: [betting]};
        this.groupMatches.push(match);

      }

    }
  }
  findMatch(matchId) {
    for(let i =0; i < this.groupMatches.length;i++) {
      if(this.groupMatches[i].matchId == matchId) {
        return  this.groupMatches[i];
      }

    }
    return null;
  }
}

