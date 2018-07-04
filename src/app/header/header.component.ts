import {Component, OnInit, OnDestroy, ChangeDetectionStrategy, ChangeDetectorRef} from '@angular/core';
import {Web3Service, SolobetService, UserService, EventEmitterService} from 'service/service';

import { Account } from 'models/account';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HeaderComponent implements OnInit, OnDestroy {

  public account: Account = new Account();
  public searchText: string = '';
  public networkAvailable: boolean;
  private _reloadPage;


  constructor(
    private _web3Service: Web3Service,
    private _solobetService: SolobetService,
    private _userService: UserService,
    private _cd: ChangeDetectorRef,
    private _eventEmitter: EventEmitterService
  ) {

  }

  ngOnInit() {
    if (this._web3Service.web3) {
      this.loadNetworkInfo();
      this._getAccount();

      this._reloadPage = this._eventEmitter.caseNumber$
        .subscribe(res => {
          if (res.type === 'reload') {
            this._getBalance();
          }
        });
    }
  }

  loadNetworkInfo () {
    this.networkAvailable = false;
    this._solobetService.Solobet.deployed().then(() => {

      const network = this._web3Service.getNetworkInfo();
      this.account.network = network.provider;
      this.account.address = network.selectedAddress;
      if (this.account.address === undefined) {
        this.networkAvailable = false;
      } else {
        this.networkAvailable = true;
      }
      this._cd.detectChanges();
    });

    this._cd.detectChanges();
  }

  ngOnDestroy() {
    this._reloadPage.unsubscribe();
  }

  private _getAccount() {
    this._web3Service.getAccounts()
      .subscribe(res => {
        this.account.address = res[0];
        this._cd.detectChanges();
        this._getBalance();
      });
  }

  private _getBalance() {
    this._userService.getBalance(this.account.address)
      .subscribe(res => {
        this.account.available_banlance = res;
        this._getPlacedBalance();
        this._cd.detectChanges();
      });
  }

  private _getPlacedBalance() {
    this._solobetService.getPlacedBalance(this.account.address)
      .subscribe(balance => {
        this.account.placed_balance = balance;
        this._cd.detectChanges();
      });
  }

  public search() {
    this._eventEmitter.publishData({type: 'search', data: this.searchText});
  }

  public openSidebar() {
    this._eventEmitter.publishData({type: 'account-infor-open', data: {
      account: this.account
    }});
  }
}
