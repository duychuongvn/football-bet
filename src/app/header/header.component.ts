import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef, HostListener } from '@angular/core';
import { Web3Service, SolobetService, UserService } from 'service/service';

import { Account } from 'models/account';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HeaderComponent implements OnInit {

  public account: Account = new Account();
  public searchText: string = '';
  public networkAvailable: boolean;
  public isOpenProfile = false;

  constructor(
    private _web3Service: Web3Service,
    private _solobetService: SolobetService,
    private _userService: UserService,
    private _cd: ChangeDetectorRef
  ) { }

  @HostListener('window:scroll', [])
  onWindowScroll() {
    this.isOpenProfile = false;
  }

  public toggleProfile(status) {
    this.isOpenProfile = status;
  }

  ngOnInit() {
    this.handleMetaMaskUpdate();
    if (this._web3Service.web3) {
      this.loadNetworkInfo();
    }
  }

  handleMetaMaskUpdate = () => {
    this._web3Service.web3.currentProvider.publicConfigStore.on('update', e => {
      if (e.selectedAddress != null && e.selectedAddress != this.account.address) {
        this.loadNetworkInfo();
      } else if (e.selectedAddress == null) {
        this.networkAvailable = false;
        this.account.address = null;
        this._cd.detectChanges();
      }
    });
  };

  loadNetworkInfo() {
    this.networkAvailable = false;


    // this._solobetService.Solobet.deployed().then(() => {
    //     //
          const network = this._web3Service.getNetworkInfo();
          this.account.network = network.provider;
          this.account.address = network.selectedAddress;
          if (this.account.address === undefined) {
            this.networkAvailable = false;
          } else {
            this.networkAvailable = true;
            this._getAccount();
          }
          this._cd.detectChanges();
        // });

    this._cd.detectChanges();
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
}
