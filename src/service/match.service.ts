import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {fromPromise} from 'rxjs/observable/fromPromise';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import 'rxjs/add/operator/map';

declare var require: any;

const httpOptions = {
  headers: new HttpHeaders({'Content-Type': 'application/json'})
};

const API_KEY = '243fcce4927d5972d2bc02951ebc15245d90c78af66f9afa74120ce87b8ebc31';

@Injectable()
export class MatchService {

  constructor(private http: HttpClient) {
  }

  // Uses http.get() to load data from a single API endpoint

  getMatches(): Observable<any> {

    let uri = 'https://apifootball.com/api/?action=get_events&from=2018-06-15&to=2018-07-15&league_id=1738&APIkey=' + API_KEY;
    return Observable.create(observer => {
      this.http.get(uri)
       // .toArray()
        .subscribe(result => {
          console.log(result.toString());
          observer.next(result);
          observer.complete();
        });
    });
  }
}
