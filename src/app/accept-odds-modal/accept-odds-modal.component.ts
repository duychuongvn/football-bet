import { Component, OnInit } from '@angular/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';

import { SolobetService, NotifyService } from 'service/service';
import { Handicap } from 'models/handicap';
import { Match } from 'models/match';
import { Betting } from 'models/betting';
import { Fixture } from 'models/fixture';


@Component({
  selector: 'app-accept-odds-modal',
  templateUrl: './accept-odds-modal.component.html',
  styleUrls: ['./accept-odds-modal.component.css']
})
export class AcceptOddsModalComponent implements OnInit {

  public title: string;
  public btnSubmit: string;
  public handicap: Handicap = new Handicap();
  public match: Match = new Match();
  public account: string;
  public bettings: Betting[] = [];
  public betting: Betting = new Betting();
  public bettingId: any;
  public fixture: Fixture = new Fixture();

  constructor(
    private _bsModalService: BsModalService,
    private _bsModalRef: BsModalRef,
    private _solobetService: SolobetService,
    private _notify: NotifyService
  ) { }

  ngOnInit() { }
  public close(reason?: string) {
    this._bsModalService.setDismissReason(reason);
    this._bsModalRef.hide();
  }

  public deal(betting) {
    if (this.account === betting.offer) {
      this._notify.error(`Self-bet is not allowed.`);
      this.close();
      return;
    }

    this._solobetService.deal(this.account, betting.matchId, betting.bettingId)
    .subscribe(() => {
        this._notify.success('Accept success');
        this.close('reload');
      }, e => {
        this._notify.error(`Error occur when offer this match ${e.msg}`);
      }
    );
  }
}
