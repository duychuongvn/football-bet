import { Component, OnInit } from '@angular/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';

import { SolobetService, NotifyService } from "service/service";
import { Handicap } from 'models/handicap';
import { Match } from 'models/match';
import { Betting } from 'models/betting';
import { Fixture } from "models/fixture";


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
  public bettingId: any
  public fixture: Fixture = new Fixture();

  constructor(
    private _bsModalService: BsModalService,
    private _bsModalRef: BsModalRef,
    private _solobetService: SolobetService,
    private _notify: NotifyService
  ) { }

  ngOnInit() {

  }


  private _fetchBetById(bettingId: string){
    this._solobetService.getBetting(this.match.matchId,bettingId).subscribe(res => {
      setTimeout(() => {
        this.betting = res;
      })
    })
  }
  public close(reason?: string) {
    this._bsModalService.setDismissReason(reason);
    this._bsModalRef.hide();
  }


  private _loadBettings(id: string) {
    this._solobetService.loadBettings(id)
    .subscribe(res => {
      let _bettings = [];
      setTimeout(() => {
        console.log(res)
        res.bettings.map(betting => {
          if(betting.selectedTeam == 0)
          {
            betting.homeOffer = betting.homeOffer;
          }else{
            betting.awayOffer = betting.awayOffer;
          }
          _bettings.push(betting);
        });
        this.bettings = _bettings;
      }, 200);
    }, errors => {
      this._notify.error(errors);
    });
  }

  public deal(betting) {
    console.log(betting);
    console.log(this.account)
    console.log(betting.bettingId)

    if(this.account === betting.offer){
      this._notify.error(`Self-bet is not allowed.`);
      this.close('reload')
      return;
    }

    this._solobetService.deal(this.account, betting.matchId, betting.bettingId).subscribe(
      result => {
        console.log(result)
        this._notify.success('Accept success');
        this.close('reload');
      },
      e => {
        this._notify.error(
          "Error occur when offer this match " + e.msg
        );      }
    );
  }
}
