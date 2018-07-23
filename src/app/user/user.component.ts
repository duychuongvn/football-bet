import { Component, NgZone } from '@angular/core';
import { Web3Service, NotifyService } from 'service/service';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})

export class UserComponent {

  account: any;
  accounts: any;

  private _matchId: string;

  public isLoading = false;

  public recommendMatch = [
    {
      id: 1,
      name: 'brazil - mexico'
    },
    {
      id: 2,
      name: 'sweden - switzerland'
    },
    {
      id: 3,
      name: 'colombia - england'
    },
    {
      id: 4,
      name: 'colombia1 - england1'
    }
  ];

  constructor(
    private _ngZone: NgZone,
    private web3Service: Web3Service,
    private _notify: NotifyService,
  ) {
    this._getAccount();
  }

  private _getAccount() {
    this.web3Service.getAccounts()
      .subscribe(accs => {
        this.accounts = accs;
        this.account = this.accounts[0];

        // This is run from window:load and ZoneJS is not aware of it we
        // need to use _ngZone.run() so that the UI updates on promise resolution
        this._ngZone.run(() => {});
      }, err => {
        this._notify.error(err);
      });
  }

  public showAccordion(matchId: string) {
    this._matchId = matchId;
  }

  public isShowAccordion(matchId: string) {
    return this._matchId === matchId;
  }
}

