import { Injectable } from '@angular/core';
import {Http} from '@angular/http';

@Injectable({
  providedIn: 'root'
})
export class JhelperService {

  fixtures: any;
  constructor(private http: Http) { 
  
  }

  public fetchFixtures(): any{
    return this.http.get('assets/fixtures.json')
      .map(res => {
        return res.json();
      });
  }

}
