import { Component, OnInit } from '@angular/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';

import { SolobetService, NotifyService } from "service/service";
import { Handicap } from 'models/handicap';
import { Match } from 'models/match';
import { Betting } from 'models/betting';


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

  constructor(
    private _bsModalService: BsModalService,
    private _bsModalRef: BsModalRef,
    private _solobetService: SolobetService,
    private _notify: NotifyService
  ) { }

  ngOnInit() {
    // console.log(this.bettings)
    // let _betting = this.bettings.filter(betting => betting.bettingId === this.bettingId)[0];
    // if(_betting){
    //   this.betting = new Betting({
    //     bettingId: _betting.bettingId,
    //     matchId: _betting.matchId,
    //     amount: _betting.amount,
    //     offer: _betting.offer,
    //     dealer: _betting.dealer,
    //     odds: _betting.odds,
    //     stake: _betting.amount,
    //     status: _betting.status,
    //     pair: _betting.pair,
    //     homeOffer:"",
    //     awayOffer:"",
    //     homeDealer:"",
    //     awayDealer:""})
    // }

    console.log(this.handicap)
    console.log(this.betting)
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
        res.bettings.map(item => {
          if(item.pair == 0)
          {
            item.homeOffer = item.offer;
          }else{
            item.awayOffer = item.offer;
          }
          console.log(item)
          _bettings.push(item);
        });
        this.bettings = _bettings;
      }, 200);
    }, errors => {
      this._notify.error(errors);
    });
  }

  public deal(betting) {
    console.log(betting);
    this._solobetService.deal(this.account, betting.matchId, betting.bettingId).subscribe(
      result => {
        this._loadBettings(betting.matchId);
        this._notify.success('Accept success');
        this.close('reload');
      },
      e => {
        console.log(e);
      }
    );
  }
}
