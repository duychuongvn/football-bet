import { Injectable } from '@angular/core';
import {Observable} from 'rxjs';
import {fromPromise} from 'rxjs/observable/fromPromise';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Web3Service} from './web3.service';

declare var require: any;

@Injectable()
export class UserService {


  constructor(
    private web3Ser: Web3Service,
  ) {

  }

  getBalance(account) : Observable<number> {

    return Observable.create(observable => {
      this.web3Ser.getBalance(account).subscribe(balance => {
        observable.next(balance);
        observable.complete();
      });
    })


  }

}
