import { Component, OnInit, OnDestroy, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { Web3Service, SolobetService, UserService, EventEmitterService } from 'service/service';

import { Account } from 'models/account';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HeaderComponent implements OnInit, OnDestroy {

  public account: Account = new Account();
  private _reloadPage;

  constructor(
    private _web3Service: Web3Service,
    private _solobetService: SolobetService,
    private _userService: UserService,
    private _cd: ChangeDetectorRef,
    private _eventEmitter: EventEmitterService
  ) { }

  ngOnInit() {
    this._getAccount();

    this._reloadPage = this._eventEmitter.caseNumber$
      .subscribe(res => {
        if (res.type === 'reload') {
          this._getBalance();
        }
      });
  }

  ngOnDestroy() {
    this._reloadPage.unsubscribe();
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
