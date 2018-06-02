import { Component, NgZone } from '@angular/core';
import {Web3Service, SolobetService} from '../../service/service';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent  {

  account: any;
  accounts: any;
  match = {matchId: '', homeTeam: '', awayTeam: '', homeGoals: 0, awayGoals: 0, time: 0, status: 0};

  bettings: any;
  amount: 0;
  rate1: 0;
  rate2: 0;
  constructor(private _ngZone: NgZone,
              private  web3Service: Web3Service,
              private  solobetService: SolobetService) {


    this.onReady();
  }
  onReady = () => {
    this.web3Service.getAccounts().subscribe(accs => {
      this.accounts = accs;
      this.account = this.accounts[0];

      // This is run from window:load and ZoneJS is not aware of it we
      // need to use _ngZone.run() so that the UI updates on promise resolution
      this._ngZone.run(() => {
          this.loadMatches();
          this.loadBettings();
        }
      );
    }, err => alert(err));
  }

  loadMatches = () => {

    this.solobetService.loadMatches('0x00615ac0bbee39cf8b51f5cc986881ad8128b347e58b08ba4a05e3c5bd4074b7')
      .subscribe(match => {
        this.match = match;
      }, e => {console.log(e); });
  }

  loadBettings = () => {
    this.solobetService.loadBettings( '0x00615ac0bbee39cf8b51f5cc986881ad8128b347e58b08ba4a05e3c5bd4074b7')
      .subscribe(bettings => {
        this.bettings = bettings;
      }, e => {console.log(e); });
  }

  deal = () => {
    this.solobetService.deal(this.account, '0x00615ac0bbee39cf8b51f5cc986881ad8128b347e58b08ba4a05e3c5bd4074b7',0)
      .subscribe(result => {
        this.loadBettings();
      }, e => {console.log(e); alert(e)});

  }

  updateScore = () => {
    this.solobetService.updateScore( this.account,'0x00615ac0bbee39cf8b51f5cc986881ad8128b347e58b08ba4a05e3c5bd4074b7',3,0);
    this.loadMatches();
  }


}
