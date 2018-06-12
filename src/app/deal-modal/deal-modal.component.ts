import { Component, OnInit } from '@angular/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';

import { SolobetService } from "service/service";

import { Fixture } from "models/fixture";
import { Handicap } from "models/handicap";
import { Match } from "models/match";

@Component({
  selector: 'app-deal-modal',
  templateUrl: './deal-modal.component.html',
  styleUrls: ['./deal-modal.component.css']
})
export class DealModalComponent implements OnInit {

  public title: string;
  public account: string;
  public match: Match = new Match();
  public fixture: Fixture = new Fixture();
  public handicap: Handicap = new Handicap();

  public oddsArray = Handicap.oddsArray;

  constructor(
    private _bsModalService: BsModalService,
    private _bsModalRef: BsModalRef,
    private _solobetService: SolobetService
  ) { }

  ngOnInit() {
  }

  public offer(handicap: Handicap) {
    console.log(handicap);
    // this._prepareMatches(handicap);

    this._solobetService
      .newOffer(this.account, this.match, +handicap.odds, handicap.stake)
      .subscribe(
        result => {
          console.log("====begin loadBettings=====");
          this.loadBettings(this.match);
          console.log("====end loadBettings=====");
        }, e => {
          console.error("Invalid number of arguments to Solidity function", e);
        }
      );
  }

  public loadBettings(match) {
    this._solobetService.loadBettings(match.id).subscribe(
      bettings => {
        match.bettings = bettings;
        this.close('reload');
      },
      e => {
        console.log(e);
      }
    );
  }

  private _prepareMatches(handicap) {
    this.match.matchId = handicap.id;
    this.match.homeTeam = this.fixture.homeTeamName;
    this.match.awayTeam = this.fixture.awayTeamName;
    let time = new Date(handicap.date);
    console.log(time.getTime());
    this.match.time = time.getTime();
    console.log(this.match);
    console.log(handicap);
  }

  public close(reason?: string) {
    this._bsModalService.setDismissReason(reason);
    this._bsModalRef.hide();
  }
}
