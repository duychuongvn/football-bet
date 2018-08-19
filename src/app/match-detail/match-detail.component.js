import * as tslib_1 from "tslib";
import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BsModalService } from 'ngx-bootstrap/modal';
import { Web3Service, SolobetService, NotifyService, EventEmitterService, BetherService } from 'service/service';
import { URLSearchParams } from '@angular/http';
import { Fixture } from 'models/fixture';
import { Handicap } from 'models/handicap';
import { Match } from 'models/match';
import { Betting } from 'models/betting';
import { DealModalComponent } from 'app/deal-modal/deal-modal.component';
import { AcceptOddsModalComponent } from 'app/accept-odds-modal/accept-odds-modal.component';
import { environment } from 'environments/environment';
import * as clone from 'lodash/clone';
let MatchDetailComponent = class MatchDetailComponent {
    constructor(_route, _web3Service, _solobetService, _modalService, _notify, _eventEmitter, _betheService) {
        this._route = _route;
        this._web3Service = _web3Service;
        this._solobetService = _solobetService;
        this._modalService = _modalService;
        this._notify = _notify;
        this._eventEmitter = _eventEmitter;
        this._betheService = _betheService;
        this.fixture = new Fixture();
        this.handicap = new Handicap();
        this.match = new Match();
        this.bettings = [];
        this.betting = new Betting();
        this.isLoading = false;
        this._bettingsCount = 0;
        this.isSharePage = false;
    }
    ngOnInit() {
        this._getAccounts();
        this._route.queryParams.subscribe(p => {
            if (p.id && !p.bettingId) {
                this._setProperties(p);
                this._loadBettings(p.id);
            }
            else if (p.bettingId) {
                this._setProperties(p);
                this._findBettingByMatchIdAndBettingId(p);
            }
        });
    }
    _setProperties(p) {
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
    _getAccounts() {
        this._web3Service.getAccounts()
            .subscribe(accs => {
            this.account = accs[0];
        }, err => alert(err));
    }
    _loadBettings(id) {
        alert('a');
        this._betheService.getBettings(0x133);
        this._solobetService.loadBettings(id)
            .subscribe(res => {
            setTimeout(() => {
                this.bettings = res.bettings;
                if (this._runTime && this.bettings.length >= this._bettingsCount) {
                    clearInterval(this._runTime);
                    this._bettingsCount = 0;
                    this.isLoading = false;
                    this._oldBettings = clone(this.bettings);
                    this._eventEmitter.publishData({ type: 'reload', data: null });
                }
            }, 200);
        }, errors => {
            this._notify.error(errors);
        });
    }
    openHandicap() {
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
    openDeal() {
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
    openAcceptOdds(betting) {
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
    _openModalWithComponent(comp, opts) {
        const subscribe = this._modalService.onHidden.subscribe((res) => {
            if (res === 'reload') {
                this._runTime = setInterval(() => {
                    this._loadBettings(this.match.matchId);
                }, 2000);
                this.isLoading = true;
                this._bettingsCount += 1;
            }
            else {
                this._bettingsCount = 0;
            }
            subscribe.unsubscribe();
        });
        this._modalService.show(comp, opts);
    }
    _findBettingByMatchIdAndBettingId(p) {
        let matchId = p.id;
        let bettingId = p.bettingId;
        if (matchId || bettingId) {
            this._solobetService.getBetting(matchId, bettingId).subscribe(betting => {
                this.bettings.push(betting);
                this.isSharePage = true;
            }, errors => {
                this._notify.error(errors);
            });
        }
    }
    buildLink(betting) {
        let json = this.fixture.pickJson();
        let params = new URLSearchParams();
        for (let key in json) {
            params.set(key, json[key]);
        }
        params.set("bettingId", betting.bettingId);
        this._copyLink(params.toString());
    }
    _copyLink(val) {
        let selBox = document.createElement('textarea');
        selBox.style.position = 'fixed';
        selBox.style.left = '0';
        selBox.style.top = '0';
        selBox.style.opacity = '0';
        selBox.value = environment.contextpath + "/match-detail?" + val;
        document.body.appendChild(selBox);
        selBox.focus();
        selBox.select();
        document.execCommand('copy');
        document.body.removeChild(selBox);
        this._notify.info('Copy Successful Crypto P2P Betting');
    }
};
MatchDetailComponent = tslib_1.__decorate([
    Component({
        selector: 'app-match-detail',
        templateUrl: './match-detail.component.html',
        styleUrls: ['./match-detail.component.css']
    }),
    tslib_1.__metadata("design:paramtypes", [typeof (_a = typeof ActivatedRoute !== "undefined" && ActivatedRoute) === "function" && _a || Object, typeof (_b = typeof Web3Service !== "undefined" && Web3Service) === "function" && _b || Object, typeof (_c = typeof SolobetService !== "undefined" && SolobetService) === "function" && _c || Object, typeof (_d = typeof BsModalService !== "undefined" && BsModalService) === "function" && _d || Object, typeof (_e = typeof NotifyService !== "undefined" && NotifyService) === "function" && _e || Object, typeof (_f = typeof EventEmitterService !== "undefined" && EventEmitterService) === "function" && _f || Object, typeof (_g = typeof BetherService !== "undefined" && BetherService) === "function" && _g || Object])
], MatchDetailComponent);
export { MatchDetailComponent };
var _a, _b, _c, _d, _e, _f, _g;
//# sourceMappingURL=match-detail.component.js.map