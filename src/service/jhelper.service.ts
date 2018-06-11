import { Injectable } from "@angular/core";
import { Http } from "@angular/http";
import { Team } from "../models/team";

@Injectable({
  providedIn: "root"
})
export class JhelperService {
  fixtures: any;

  teams: Team[] = [];
  constructor(private http: Http) {}

  public fetchFixtures(): any {
    return this.http.get("assets/fixtures.json").map(res => {
      return res.json();
    });
  }

  public fetchTeam(): any {
    return this.http.get("assets/teams.json").map(resp => {
      return resp.json();
    });
  }
}
