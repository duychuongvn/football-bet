import { Component, OnInit } from "@angular/core";
import { BsModalService, BsModalRef } from "ngx-bootstrap/modal";
import { Betting } from "models/betting";

import { SolobetService, NotifyService } from "service/service";

import { Fixture } from "models/fixture";
import { Handicap } from "models/handicap";
import { Match } from "models/match";

import { PAIR_TYPE } from "enums/handicap";

@Component({
  selector: "app-deal-modal",
  templateUrl: "./deal-modal.component.html",
  styleUrls: ["./deal-modal.component.css"]
})
export class DealModalComponent implements OnInit {
  public title: string;
  public btnSubmit: string;
  public account: string;
  public match: Match = new Match();
  public fixture: Fixture = new Fixture();
  public handicap: Handicap = new Handicap();
  public bettings: Betting[] = [];

  public oddsArray = Handicap.oddsArray;

  public pairs: Array<Object>;

  constructor(
    private _bsModalService: BsModalService,
    private _bsModalRef: BsModalRef,
    private _solobetService: SolobetService,
    private _notify: NotifyService
  ) {}

  ngOnInit() {
    this.pairs = [
      { id: PAIR_TYPE.REVERT, value: this.handicap.pairTeam },
      { id: PAIR_TYPE.INVERSE, value: this.handicap.inversePairTeam }
    ];
  }

  public offer(handicap: Handicap) {
    console.log(handicap);
    // this._prepareMatches(handicap);

    console.log(this.match);

    this._solobetService
      .newOffer(
        this.account,
        this.match,
        handicap.odds_number,
        handicap.stake,
        handicap.selectedTeam
      )
      .subscribe(
        result => {
          // this._loadBettings(this.match.matchId.toString());
          this._notify.success("Create success");
          this.close("reload");
        },
        e => {
          this._notify.error(
            "Invalid number of arguments to Solidity function"
          );
        }
      );
  }

  private _loadBettings(id: string) {
    this._solobetService.loadBettings(id).subscribe(
      res => {
        let _bettings = [];
        setTimeout(() => {
          res.bettings.map(item => {
            if (item.pair == 0) {
              item.homeOffer = item.offer;
            } else {
              item.awayOffer = item.offer;
            }
            console.log(item);
            _bettings.push(item);
          });
          this.bettings = _bettings;
        }, 200);
      },
      errors => {
        this._notify.error(errors);
      }
    );
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
