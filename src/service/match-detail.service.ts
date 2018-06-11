import { Injectable } from '@angular/core';
import {Observable} from 'rxjs/Observable';
import { observable } from 'rxjs';
import {Router} from '@angular/router';



@Injectable({
  providedIn: 'root'
})
export class MatchDetailService {

  constructor(private _Router:Router) { }

  display(_match) : Observable<any>{
    console.log("==========")
      return Observable.create(observer => {
        observer.next(_match);
        observer.complete();
        this._Router.navigate(["/match-detail"]);
      })
  }

}
