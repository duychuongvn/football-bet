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
    this.solobetService.loadBettingMatchesByAccount(this.account).subscribe(result =>{
      this.bettingMatches = result;
      console.log(result);
    });
  }
}
