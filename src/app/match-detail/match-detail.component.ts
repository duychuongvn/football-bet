import { Component, OnInit, Inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { Web3Service, SolobetService, NotifyService } from 'service/service';
import {URLSearchParams} from '@angular/http';

import { Fixture } from 'models/fixture';
import { Handicap } from 'models/handicap';
import { Match } from 'models/match';
import { Betting } from 'models/betting';

import { DealModalComponent } from 'app/deal-modal/deal-modal.component';
import { AcceptOddsModalComponent } from 'app/accept-odds-modal/accept-odds-modal.component';
import { Account } from 'models/account';

import { DOCUMENT } from '@angular/platform-browser';
import { environment } from '../../environments/environment';
@Component({
  selector: 'app-match-detail',
  templateUrl: './match-detail.component.html',
  styleUrls: ['./match-detail.component.css']
})
export class MatchDetailComponent implements OnInit {

  public fixture: Fixture = new Fixture();
  public handicap: Handicap = new Handicap();
  public match: Match = new Match();
  public bettings: Betting[] = [];
  public betting: Betting = new Betting();
  public isLoading = false;
  public account: string;

  private _bettingsCount = 0;
  private _runTime;

  private isSharePage: boolean = false;

  constructor(
    private _route: ActivatedRoute,
    private _router: Router,
    private _web3Service: Web3Service,
    private _solobetService: SolobetService,
    private _modalService: BsModalService,
    private _notify: NotifyService,
    @Inject(DOCUMENT) private document: any  ) {}

  ngOnInit() {
    this._getAccounts();
    this._route.queryParams.subscribe(p => {
      console.log(p)
      if (p.id && !p.bettingId) {
        console.log("load beeting")
        this._setProperties(p);
        this._loadBettings(p.id);
      }else if(p.bettingId){
        console.log("_findBettingByMatchIdAndBettingId")
          this._setProperties(p);
          this._findBettingByMatchIdAndBettingId(p);
      }

    });
  }

  private _setProperties(p: any) {
    this.handicap = new Handicap(p);
    this.fixture = new Fixture(p);

    let time = new Date(p.date);
    this.match = new Match(p);
    this.match.matchId = p.id.toString();
    this.match.homeTeam = p.homeTeamName;
    this.match.awayTeam = p.awayTeamName;
    this.match.homeGoals = p.homeGoals;
    this.match.awayGoals = p.awayGoals;
    this.match.time = time.getTime();
    this.match.status = 0;
  }

  private _getAccounts() {
    this._web3Service.getAccounts()
    .subscribe( accs => {
        this.account = accs[0];
      }, err => alert(err)
    );
  }

  private _loadBettings(id: string) {
    this._solobetService.loadBettings(id)
    .subscribe(res => {
      setTimeout(() => {
        this.bettings = res.bettings;
        if (this._runTime && this.bettings.length >= this._bettingsCount) {
          clearInterval(this._runTime);
          this._bettingsCount = 0;
          this.isLoading = false;
        }
      }, 200);
    }, errors => {
      this._notify.error(errors);
    });
  }

  public openHandicap() {
    const _opts = {
      class: 'modal-md',
      initialState: {
        title: 'Place Bets',
        btnSubmit: 'Create',
        account: this.account,
        match: this.match,
        fixture: this.fixture,
        handicap: this.handicap
      }
    };

    this._bettingsCount = this.bettings.length;

    this._openModalWithComponent(DealModalComponent, _opts);
  }

  public openDeal() {
    const _opts = {
      class: 'modal-md',
      initialState: {
        title: 'Deal Modal',
        btnSubmit: 'Place Bet',
        account: this.account,
        match: this.match,
        fixture: this.fixture,
        handicap: this.handicap
      }
    };

    this._openModalWithComponent(DealModalComponent, _opts);
  }

  public openAcceptOdds(betting) {
    const _opts = {
      class: 'modal-md',
      initialState: {
        title: 'Place Bets',
        btnSubmit: 'Accept',
        match: this.match,
        handicap: this.handicap,
        account: this.account,
        betting: betting,
        fixture: this.fixture
      }
    };

    this._openModalWithComponent(AcceptOddsModalComponent, _opts);
  }

  private _openModalWithComponent(comp, opts?: ModalOptions) {
    const subscribe = this._modalService.onHidden.subscribe((res: any) => {
      if (res) {
        this._runTime = setInterval(() => {
          this._loadBettings(this.match.matchId);
        }, 2000);
        this.isLoading = true;
        this._bettingsCount += 1;
      } else {
        this._bettingsCount = 0;
      }

      subscribe.unsubscribe();
    });

    this._modalService.show(comp, opts);
  }


  private _findBettingByMatchIdAndBettingId(p: any){
      let matchId = p.id;
      let bettingId = p.bettingId;
      console.log(bettingId, matchId)
      if(matchId || bettingId){
        this._solobetService.getBetting(matchId, bettingId).subscribe(betting => {
          console.log(betting)
          this.bettings.push(betting);
          this.isSharePage = true;
        },errors => {
          this._notify.error(errors);
        });
      }

  }

  private _buildLink(betting){
    let json = this.fixture.pickJson();
    let params= new URLSearchParams();
    for(let key in json){
      params.set(key, json[key]);
    }
    params.set("bettingId", betting.bettingId);
    console.log(params.toString());
    this._copyLink(params.toString());
  }


  private _copyLink(val: string){

    let selBox = document.createElement('textarea');
    selBox.style.position = 'fixed';
    selBox.style.left = '0';
    selBox.style.top = '0';
    selBox.style.opacity = '0';
    selBox.value = environment.contextpath+ "/match-detail?" +val;
    document.body.appendChild(selBox);
    selBox.focus();
    selBox.select();
    document.execCommand('copy');
    document.body.removeChild(selBox);
  }

}
