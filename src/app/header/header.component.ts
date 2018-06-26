import {Component, OnInit, OnDestroy, ChangeDetectionStrategy, ChangeDetectorRef} from '@angular/core';
import {Web3Service, SolobetService, UserService, EventEmitterService} from 'service/service';

import {Account} from 'models/account';
import {async} from 'rxjs/internal/scheduler/async';

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
  public loggedInMetaMask: boolean;
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
    this.loadNetworkInfo();
    this._getAccount();

    this._reloadPage = this._eventEmitter.caseNumber$
      .subscribe(res => {
        if (res.type === 'reload') {
          //  this._getBalance();
        }
      });
  }

  loadNetworkInfo = async () => {
    this.networkAvailable = false;
    this.loggedInMetaMask = false;
    try {
      this.account.network = this._web3Service.getNetworkInfo().provider;
      this.loggedInMetaMask = true;
      this._cd.detectChanges();
    } catch (e) {
      if (e === 'Unsupport selected network') {
        this.loggedInMetaMask = true;
      } else {
        this.loggedInMetaMask = false;
      }
    }

    this._solobetService.Solobet.deployed().then(instance => {
      this.networkAvailable = true;
      this._cd.detectChanges();
    }).catch(e => {
      this.networkAvailable = false;
    });
    this._cd.detectChanges();
  };

  ngOnDestroy() {
    this._reloadPage.unsubscribe();
  }

  private async _getAccount() {
    this._web3Service.getAccounts()
      .subscribe(res => {
        this.account.address = res[0];
        this._cd.detectChanges();
        this._getBalance();
      });
  }

  private async _getBalance() {
    this._userService.getBalance(this.account.address)
      .subscribe(res => {
        // console.log(res);
        // alert(res)
        this.account.available_banlance = res;

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
}
