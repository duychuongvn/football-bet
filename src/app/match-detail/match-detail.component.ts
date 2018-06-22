import { Component, OnInit, OnDestroy, Inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { Web3Service, SolobetService, NotifyService, EventEmitterService } from 'service/service';
import { URLSearchParams } from '@angular/http';

import { Fixture } from 'models/fixture';
import { Handicap } from 'models/handicap';
import { Match } from 'models/match';
import { Betting } from 'models/betting';

import { DealModalComponent } from 'app/deal-modal/deal-modal.component';
import { AcceptOddsModalComponent } from 'app/accept-odds-modal/accept-odds-modal.component';

import { DOCUMENT } from '@angular/platform-browser';
import { environment } from 'environments/environment';

import * as clone from 'lodash/clone';
@Component({
  selector: 'app-match-detail',
  templateUrl: './match-detail.component.html',
  styleUrls: ['./match-detail.component.css']
})
export class MatchDetailComponent implements OnInit, OnDestroy {

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
  private _searchPages;
  private _oldBettings;

  constructor(
    private _route: ActivatedRoute,
    private _web3Service: Web3Service,
    private _solobetService: SolobetService,
    private _modalService: BsModalService,
    private _notify: NotifyService,
    private _eventEmitter: EventEmitterService,
    @Inject(DOCUMENT) private document: any
  ) {}

  ngOnInit() {
    this._getAccounts();
    this._route.queryParams.subscribe(p => {
      if (p.id && !p.bettingId) {
        this._setProperties(p);
        this._loadBettings(p.id);
      }else if(p.bettingId){
        this._setProperties(p);
        this._findBettingByMatchIdAndBettingId(p);
      }

    });

    this._searchPages = this._eventEmitter.caseNumber$
      .subscribe(res => {
        if (res.type === 'search') {
          this._searchBettings(res.data);
        }
      });
  }

  ngOnDestroy() {
    this._searchPages.unsubscribe();
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
          this._oldBettings = clone(this.bettings);
          this._eventEmitter.publishData({type: 'reload', data: null});
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
      if(matchId || bettingId){
        this._solobetService.getBetting(matchId, bettingId).subscribe(betting => {
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

  private _searchBettings(search: any) {
    if (!this._oldBettings) {
      this._oldBettings = clone(this.bettings);
    }

    if (search.length > 1) {
      this.bettings = this._oldBettings.filter((betting: Betting) => (betting.odds_string === search || betting.stake === +search));
    } else {
      this.bettings = this._oldBettings
    }
  }
}
