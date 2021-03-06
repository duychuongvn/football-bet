import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

declare var require: any;
const Web3 = require('web3');

declare var window: any;

@Injectable()
export class Web3Service {

  public web3: any;
  constructor() { }

  public checkAndInstantiateWeb3() {
    // Checking if Web3 has been injected by the browser (Mist/MetaMask)
    if (typeof window.web3 !== 'undefined') {
      // Use Mist/MetaMask's provider
      this.web3 = new Web3(window.web3.currentProvider);
      this.web3.currentProvider.publicConfigStore.on('update', e => {
      });
    } else {
      return false;
    }
  }

  public getNetworkInfo() {
    if (this.web3) {
      let state = this.web3.currentProvider.publicConfigStore._state;
      let providers = this.getProviders();
      for (var i = 0; i < providers.length; i++) {
        let provider = providers[i]
        if (parseInt(state.networkVersion) === provider.chainId) {
          return { selectedAddress: state.selectedAddress, provider: provider };
        }
      }
      // throw "Unsupport selected network";
      return { selectedAddress: state.selectedAddress, provider: { name: "Etherzero Private Test Net", symbol: "ETH", chainId: 4447 } };
    }
    throw "Metamask required";
  }

  getProviders() {
    let providers = new Array();
    providers.push({ name: "Ethereum", symbol: "ETH", chainId: 1 });
    // providers.push({name: "Ethereum Kova Testnet", symbol: "ETH", chainId: 42});
    providers.push({ name: "Ethereum Rinkeby Testnet", symbol: "ETH", chainId: 4 });
    providers.push({ name: "Etherzero", symbol: "ETZ", chainId: 88 });
    providers.push({ name: "Etherzero Private Test Net", symbol: "ETH", chainId: 4447 });

    return providers;
  }

  toSHA3(value) {
    return this.web3.sha3(value);
  }

  getBalance(account): Observable<number> {
    return Observable.create(observable => {
      this.web3.eth.getBalance(account, (err, balance) => {

        observable.next(balance / 1000000000000000000);
        observable.complete();
      });
    });
  }

  getAccounts(): Observable<any> {
    return Observable.create(observer => {
      this.web3.eth.getAccounts((err, accs) => {
        if (err != null) {
          observer.error('There was an error fetching your accounts.');
        }

        if (accs.length === 0) {
          observer.error('Couldn\'t get any accounts! Make sure your Ethereum client is configured correctly.');
        }
        observer.next(accs);
        observer.complete();
      });
    });
  }

}
