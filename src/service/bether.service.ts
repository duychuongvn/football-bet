import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {fromPromise} from 'rxjs/observable/fromPromise';
import {Web3Service} from './web3.service';
import {Betting} from 'models/betting';
import {log} from 'util';
import {Match} from 'models/match';

declare var require: any;
const betherABI = require('../../build/contracts/BetherABI.json');
const contract = require('truffle-contract');

@Injectable()
export class BetherService {

  contractABI: any;
  contract: any;

  constructor(
    private  web3Ser: Web3Service
  ) {

    console.log(betherABI)
    this.contractABI = this.web3Ser.web3.eth.contract(betherABI);
    console.log(this.web3Ser.web3.currentProvider)
    console.log(this.contractABI);
    this.contract = this.contractABI.at('0xf426505ac145abe033fe77c666840063757be9cd');
    console.log(this.contract);
  }

  public getBettings =  (matchId) => {
    this.contract.getBettings(matchId, (err, result) => {

      for(let i =0;i< result.length;i++) {
        console.log(i)
        this.contract.getBettingInfo(result[i].toNumber(), (err1, result1) => {
          console.log(err1);
          console.log(result1);
        })
      }
    });

  };


}
