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

    this.solobetService.loadMatches(this.account, '0x123')
      .subscribe(match => {
        this.match = match;
      }, e => {console.log(e); });
  }

  loadBettings = () => {
    this.solobetService.loadBettings(this.account, '0x123')
      .subscribe(bettings => {
        this.bettings = bettings;
      }, e => {console.log(e); });
  }

  offer = () => {
    alert(this.amount);

  }
}
