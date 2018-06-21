import { Injectable } from "@angular/core";
import { Http } from "@angular/http";
import { Team } from "../models/team";
import { Web3Service } from "service/web3.service";
import {UserService} from 'service/user.service';

import {SolobetService} from 'service/solobet.service';
import { Account } from "models/account";

@Injectable({
  providedIn: "root"
})
export class JhelperService {
  constructor(private _web3Service: Web3Service, private _http: Http, private _userService: UserService, private _solobetService: SolobetService) {}

  fixtures: any;
  account : Account = new Account();
  teams: Team[] = [];

  public fetchFixtures(): any {
    return this._http.get("assets/fixtures.json").map(res => {
      return res.json();
    });
  }

  public fetchTeam(): any {
    return this._http.get("assets/teams.json").map(resp => {
      return resp.json();
    });
  }

  public hashId(homeTeamName: string, awayTeamName: string, date: any): any {
    const _time = new Date(date);
    return this._web3Service.toSHA3(homeTeamName +awayTeamName + _time.getTime()/1000);
  }

  public _getAccount(account: Account) {
    this._web3Service.getAccounts()
      .subscribe(res => {
        console.log(res)
        account.address = res[0];
        this._getBalance(account);
      });
  }

  public _getBalance(account: Account) {
     this._userService.getBalance(this.account.address)
      .subscribe(res => {
        account.available_banlance = res;
        account.network = this._web3Service.getNetworkInfo().provider;
        this._getPlacedBalance(account);
      });
  }

  public _getPlacedBalance(account: Account) {
    this._solobetService.getPlacedBalance(account.address)
      .subscribe(balance => {
        account.placed_balance = balance;
        // this._cd.detectChanges();
      });
  }


}
