import { Component, OnInit, Inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
// import { Web3Service, SolobetService, NotifyService, EventEmitterService, MatchService } from 'service/service';
// import { URLSearchParams } from '@angular/http';

// import { Fixture } from 'models/fixture_bk';
// import { Handicap } from 'models/handicap';
// import { Match } from 'models/match';
import { Betting } from 'models/betting';
import { NewBettingInterface } from 'interfaces/betting';

import { DealModalComponent } from '../deal-modal/deal-modal.component';
import { ModalSharingBetComponent } from 'app/modal-sharing-bet/modal-sharing-bet.component';
import { AcceptOddsModalComponent } from '../accept-odds-modal/accept-odds-modal.component';

import { SORTODDS_OPTS, SORTODDS_CHILD_OPTS } from './data';

// import { environment } from 'environments/environment';

// import * as clone from 'lodash/clone';
// import { Subscription } from 'rxjs';

@Component({
  selector: 'app-match-detail',
  templateUrl: './match-detail.component.html',
  styleUrls: ['./match-detail.component.scss']
})
export class MatchDetailComponent implements OnInit {

  public betting: Betting = new Betting();

  protected oddsOpts = SORTODDS_OPTS;
  protected oddsChildOpts = SORTODDS_CHILD_OPTS.date;

  protected sortBySelected = 1;
  protected sortBySelected1 = 1;

  // static ROUTER = 'match-detail';

  // public fixture: Fixture = new Fixture();
  // public handicap: Handicap = new Handicap();
  // public match: Match = new Match();
  // public bettings: Betting[] = [];
  // public betting: Betting = new Betting();
  // public isLoading = false;
  // public account: string;

  // private _bettingsCount = 0;
  // private _runTime;

  // public isSharePage = false;
  // private _oldBettings;
  // public data;

  constructor(
    private _route: ActivatedRoute,
    private _router: Router,
    // private _web3Service: Web3Service,
    // private _solobetService: SolobetService,
    private _modalService: BsModalService,
    // private _notify: NotifyService,
    // private _eventEmitter: EventEmitterService,
    // private _matchesService: MatchService
  ) {
    // this.data = this._matchesService.reqData;
    // sessionStorage.setItem('fixtureJson', this.data);

    this._route.queryParams.subscribe((param: NewBettingInterface) => {
      this.betting = new Betting(param);
    });
  }

  ngOnInit() {
    // this._getAccounts();
    // console.log('00000=====================', this.data);
    // console.log('localstorge', sessionStorage.getItem('fixtureJson'));
    // if (!this.data) {
    //   this.data = JSON.parse(sessionStorage.getItem('fixtureJson'));
    // }
    // if (this.data.id && !this.data.bettingId) {
    //   console.log('loading data');
    //   this._setProperties(this.data);
    //   this._loadBettings(this.data.id);
    // } else if (this.data.bettingId) {
    //   console.log('have betting');

    //   this._setProperties(this.data);
    //   this._findBettingByMatchIdAndBettingId(this.data);
    // } else {
    //   console.log('do nothing');
    // }
  }

  // private _setProperties(p: any) {
  //   this.handicap = new Handicap(p);
  //   this.fixture = new Fixture(p);

  //   const time = new Date(p.date);
  //   this.match = new Match(p);
  //   this.match.matchId = p.id.toString();
  //   this.match.homeTeam = p.homeTeamName;
  //   this.match.awayTeam = p.awayTeamName;
  //   this.match.homeGoals = p.homeGoals;
  //   this.match.awayGoals = p.awayGoals;
  //   this.match.time = time.getTime();
  //   this.match.status = 0;
  // }

  // private _getAccounts() {
  //   this._web3Service.getAccounts()
  //     .subscribe(accs => {
  //       this.account = accs[0];
  //     }, err => alert(err)
  //     );
  // }

  // private _loadBettings(id: string) {
  //   this._solobetService.loadBettings(id)
  //     .subscribe(res => {
  //       setTimeout(() => {
  //         this.bettings = res.bettings;
  //         if (this._runTime && this.bettings.length >= this._bettingsCount) {
  //           clearInterval(this._runTime);
  //           this._bettingsCount = 0;
  //           this.isLoading = false;
  //           this._oldBettings = clone(this.bettings);
  //           this._eventEmitter.publishData({ type: 'reload', data: null });
  //         }
  //       }, 200);
  //     }, errors => {
  //       this._notify.error(errors);
  //     });
  // }

  public openHandicap() {
    const _opts = {
      class: 'modal-md',
      ignoreBackdropClick: true,
      initialState: {
        title: 'Create new bet',
        btnSubmit: 'Create',
        betting: this.betting
        // account: this.account,
        // match: this.match,
        // fixture: this.fixture,
        // handicap: this.handicap
      }
    };

    // this._bettingsCount = this.bettings.length;

    this._openModalWithComponent(DealModalComponent, _opts);
  }

  public openModalShareBet() {
    const _opts = {
      class: 'modal-md'
    };

    this._openModalWithComponent(ModalSharingBetComponent, _opts);
  }

  // public openDeal() {
  //   const _opts = {
  //     class: 'modal-md',
  //     initialState: {
  //       title: 'Deal Modal',
  //       btnSubmit: 'Place Bet',
  //       account: this.account,
  //       match: this.match,
  //       fixture: this.fixture,
  //       handicap: this.handicap
  //     }
  //   };

  //   this._openModalWithComponent(DealModalComponent, _opts);
  // }

  public openAcceptOdds(betting) {
    const _opts = {
      class: 'modal-md',
      ignoreBackdropClick: true,
      initialState: {
        title: 'Settle Bet',
        btnSubmit: 'Settle',
        betting: this.betting
        // match: this.match,
        // handicap: this.handicap,
        // account: this.account,
        // betting: betting,
        // fixture: this.fixture
      }
    };

    this._openModalWithComponent(DealModalComponent, _opts);
  }

  private _openModalWithComponent(comp, opts?: ModalOptions) {
    // const subscribe = this._modalService.onHidden.subscribe((res: any) => {
    //   if (res === 'reload') {
    //     this._runTime = setInterval(() => {
    //       this._loadBettings(this.match.matchId);
    //     }, 2000);
    //     this.isLoading = true;
    //     this._bettingsCount += 1;
    //   } else {
    //     this._bettingsCount = 0;
    //   }

    //   subscribe.unsubscribe();
    // });

    this._modalService.show(comp, opts);
  }

  // private _findBettingByMatchIdAndBettingId(p: any) {
  //   const matchId = p.id;
  //   const bettingId = p.bettingId;
  //   if (matchId || bettingId) {
  //     this._solobetService.getBetting(matchId, bettingId).subscribe(betting => {
  //       this.bettings.push(betting);
  //       this.isSharePage = true;
  //     }, errors => {
  //       this._notify.error(errors);
  //     });
  //   }
  // }

  // public buildLink(betting) {
  //   const json = this.fixture.pickJson();
  //   const params = new URLSearchParams();
  //   for (const key of Object.keys(json)) {
  //     params.set(key, json[key]);
  //   }
  //   params.set('bettingId', betting.bettingId);
  //   this._copyLink(params.toString());
  // }

  // private _copyLink(val: string) {
  //   const selBox = document.createElement('textarea');
  //   selBox.style.position = 'fixed';
  //   selBox.style.left = '0';
  //   selBox.style.top = '0';
  //   selBox.style.opacity = '0';
  //   selBox.value = environment.contextpath + '/match-detail?' + val;
  //   document.body.appendChild(selBox);
  //   selBox.focus();
  //   selBox.select();
  //   document.execCommand('copy');
  //   document.body.removeChild(selBox);
  //   this._notify.info('Copy Successful Crypto P2P Betting');
  // }
}
