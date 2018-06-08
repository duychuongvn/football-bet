import {Component, NgZone} from '@angular/core';

import {Web3Service, SolobetService, MatchService} from '../../service/service';
import {log} from 'util';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent {

  account: any;
  accounts: any;
  match = {matchId: '', homeTeam: '', awayTeam: '', homeGoals: 0, awayGoals: 0, time: 0, status: 0};
  upcommingMatches: any[];
  bettings: any;
  amount: 0;
  rate1: 0;
  rate2: 0;

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
          this.initMatches();
        }
      );
    }, err => alert(err));
  };

  initMatches = () => {

    this.upcommingMatches = new Array();
    this.solobetService.loadBettingMatches().subscribe(result => {


       for(let i = 0;i < result.length;i ++) {
         this.solobetService.loadMatches(result[i]).subscribe(match => {
           console.log(match);
           this.upcommingMatches.push(match);
         });
       }
    });
  };
  updateScore = (match) => {
    this.solobetService.updateScore(this.account, match.matchId, parseInt(match.homeScore), parseInt(match.awayScore));
    this.initMatches();
  };
  approveScore = (match) => {
    this.solobetService.approveScore(this.account, match.matchId);
    this.initMatches();
  };




}
