import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { Web3Service, SolobetService, MatchService, UserService } from 'service/service';

import { Account } from 'models/account';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HeaderComponent implements OnInit {

  public account: Account = new Account();

  constructor(
    private _web3Service: Web3Service,
    private _solobetService: SolobetService,
    private _matchService: MatchService,
    private _userService: UserService,
    private _cd: ChangeDetectorRef,
  ) { }

  ngOnInit() {
    this._getAccount();
  }


  private async _getAccount() {
    this._web3Service.getAccounts()
      .subscribe(res => {
        this.account.address = res[0];
        this._getBalance();
      });
  }

  private async _getBalance() {
    await this._userService.getBalance(this.account.address)
      .subscribe(res => {
        this.account.available_banlance = res;
        this.account.network = this._web3Service.getNetworkInfo().provider;
        this._getPlacedBalance();
      });
  }

  private _getPlacedBalance() {
    this._solobetService.getPlacedBalance(this.account.address)
      .subscribe(balance => {
        this.account.placed_balance = balance;
        this._cd.detectChanges();
      });
  }
}
