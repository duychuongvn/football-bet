import {Injectable} from '@angular/core';

import {Observable} from 'rxjs/Observable';
import {fromPromise} from 'rxjs/observable/fromPromise';

import {environment} from '../environments/environment';
import {Network} from '../models/Network';
import {NetworkProvider} from '../models/NetworkProvider';

declare var require: any;
const Web3 = require('web3');

declare var window: any;

@Injectable()
export class Web3Service {

  public web3: any;
  networkSymbol: any;
  accountBalance: number;
  networkInfo: any;
  constructor() {
    this.checkAndInstantiateWeb3();
  }

  checkAndInstantiateWeb3 = () => {
    // Checking if Web3 has been injected by the browser (Mist/MetaMask)
    if (typeof window.web3 !== 'undefined') {
      // Use Mist/MetaMask's provider
      this.web3 = new Web3(window.web3.currentProvider);
    } else {
      alert('Need to install meta mask');
    }
  }


  getNetworkInfo() {
    let state = this.web3.currentProvider.publicConfigStore._state;

    let providers = this.getProviders();
    for(var i = 0; i < providers.length; i++) {
      let provider = providers[i]
      if(state.networkVersion == provider.chainId) {
        let networkProvider = new NetworkProvider({name: provider.name, symbol: provider.symbol, networkVersion: provider.chainId, url: ''});

        this.networkInfo = new  Network({selectedAddress: state.selectedAddress, provider: networkProvider});
        break;
      }
    }
    if(this.networkInfo == null) {
      console.log(state)
      this.networkInfo = {selectedAccount: state.selectedAddress, provider: {name: "Ethereum Private Network", symbol: "ETH", chainId: 88}}
    }
    return this.networkInfo;
  }

  getProviders(){

    let providers = new Array();
    providers.push({name: "Ethereum", symbol: "ETH", chainId: 1});
    providers.push({name: "Ethereum Kova Testnet", symbol: "ETH", chainId: 3});
    providers.push({name: "Ethereum Rinkeby Testnet", symbol: "ETH", chainId: 4});
    providers.push({name: "Etherzero", symbol: "ETZ", chainId: 88});

    return providers;
  }
  toSHA3(value) {
    return this.web3.sha3(value);
  }

  getBalance(account) : Observable<number> {
    return Observable.create(observable => {
      this.web3.eth.getBalance(account, (err, balance)=> {
        observable.next(balance/1000000000000000000);
        observable.complete();
      })
    })
  }

  getNetworkSympol() {
    return this.networkSymbol;
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

        this.web3.eth.getBalance(accs[0],(err, balance)=>{
          this.accountBalance = balance / 1000000000000000000;
        });
        observer.next(accs);
        observer.complete();
      });
    });
  }

}
