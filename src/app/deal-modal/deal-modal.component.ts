import { Component, OnInit } from '@angular/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';

import { SolobetService, NotifyService } from "service/service";

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
  public btnSubmit: string;
  public account: string;
  public match: Match = new Match();
  public fixture: Fixture = new Fixture();
  public handicap: Handicap = new Handicap();

  public oddsArray = Handicap.oddsArray;

  constructor(
    private _bsModalService: BsModalService,
    private _bsModalRef: BsModalRef,
    private _solobetService: SolobetService,
    private _notify: NotifyService
  ) { }

  ngOnInit() {
  }

  public offer(handicap: Handicap) {
    console.log(handicap);
    // this._prepareMatches(handicap);

    this._solobetService
      .newOffer(this.account, this.match, +handicap.odds, handicap.stake)
      .subscribe(result => {
          console.log("====begin loadBettings=====");
          this.loadBettings(this.match);
          console.log("====end loadBettings=====");
        }, e => {
          this._notify.error("Invalid number of arguments to Solidity function");
        }
      );
  }

  public loadBettings(match) {
    this._solobetService.loadBettings(match.id)
    .subscribe( bettings => {
      console.log(bettings)
      match.bettings = bettings;
      this._notify.success('Create success');
      this.close('reload');
    }, errors => {
      this._notify.error(errors);
    });
  }

  private _prepareMatches(handicap) {
    this.match.matchId = handicap.id;
    this.match.homeTeam = this.fixture.homeTeamName;
    this.match.awayTeam = this.fixture.awayTeamName;
    let time = new Date(handicap.date);
    this.match.time = time.getTime();
  }

  public close(reason?: string) {
    this._bsModalService.setDismissReason(reason);
    this._bsModalRef.hide();
  }
}
