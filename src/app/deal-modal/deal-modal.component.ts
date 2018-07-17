import { Component, OnInit } from '@angular/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';

import { SolobetService, NotifyService } from 'service/service';

import { Fixture } from 'models/fixture';
import { Handicap } from 'models/handicap';
import { Match } from 'models/match';

import { PAIR_TYPE } from 'enums/handicap';

@Component({
  selector: 'app-deal-modal',
  templateUrl: './deal-modal.component.html',
  styleUrls: ['./deal-modal.component.scss']
})
export class DealModalComponent implements OnInit {
  public title: string;
  public btnSubmit: string;
  public account: string;
  public match: Match = new Match();
  public fixture: Fixture = new Fixture();
  public handicap: Handicap = new Handicap();

  public oddsArray = Handicap.oddsArray;

  public oddsArr = Handicap.oddsArr;
  public pairs: Array<Object>;

  constructor(
    private _bsModalService: BsModalService,
    private _bsModalRef: BsModalRef,
    private _solobetService: SolobetService,
    private _notify: NotifyService
  ) { }

  ngOnInit() {
    this.pairs = [
      { id: PAIR_TYPE.REVERT, value: this.handicap.pairTeam },
      { id: PAIR_TYPE.INVERSE, value: this.handicap.inversePairTeam }
    ];
  }

  public markTeam(teamName: string) {
    if (teamName === this.handicap.homeTeamName) {
      this.handicap.selectedTeam = '0';
    } else {
      this.handicap.selectedTeam = '1';
    }
  }

  public offer(handicap: Handicap) {
    this._solobetService.newOffer(
        this.account,
        this.match,
        handicap.odds_number * 100,
        handicap.stake,
        handicap.selectedTeam
      ).subscribe(() => {
          this._notify.success('Create success');
          this.close('reload');
        }, e => {
          this._notify.error(`Error occur when offer this match ${e.msg}`);
        }
      );
  }

  public close(reason?: any) {
    this._bsModalService.setDismissReason(reason);
    this._bsModalRef.hide();
  }

  public activeTeam(teamNumber) {
    return +this.handicap.selectedTeam === teamNumber;
  }
}
