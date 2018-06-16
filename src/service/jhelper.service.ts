import { Injectable } from "@angular/core";
import { Http } from "@angular/http";
import { Team } from "../models/team";
import { Web3Service } from "service/web3.service";

@Injectable({
  providedIn: "root"
})
export class JhelperService {
  constructor(private _web3Service: Web3Service, private _http: Http) {}

  fixtures: any;

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
}
