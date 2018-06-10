import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { Fixture } from "../../models/fixture";

@Component({
  selector: "app-match-detail",
  templateUrl: "./match-detail.component.html",
  styleUrls: ["./match-detail.component.css"]
})
export class MatchDetailComponent implements OnInit {
  public fixture: Fixture = new Fixture();

  constructor(private _route: ActivatedRoute, private _router: Router) {}

  ngOnInit() {
    this._route.queryParams.subscribe(p => {
      if (p.id) {
        this._setProperties(p);
      } else {
        this._router.navigate([""]);
      }
    });
  }

  private _setProperties(p: any) {
    this.fixture.id = +p.id;
    this.fixture.awayFlag = p.awayFlag;
    this.fixture.awayTeamId = p.awayTeamId;
    this.fixture.awayTeamName = p.awayTeamName;
    this.fixture.competitionId = p.competitionId;
    this.fixture.date = p.date;
    this.fixture.homeFlag = p.homeFlag;
    this.fixture.homeTeamId = p.homeTeamId;
    this.fixture.homeTeamName = p.homeTeamName;
    this.fixture.status = p.status;
  }
}
