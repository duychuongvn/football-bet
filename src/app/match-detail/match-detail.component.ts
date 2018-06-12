import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { Web3Service } from "service/service";

import { Fixture } from "models/fixture";
import { Handicap } from "models/handicap";
import { Match } from "models/match";

import { DealModalComponent } from 'app/deal-modal/deal-modal.component';

@Component({
  selector: "app-match-detail",
  templateUrl: "./match-detail.component.html",
  styleUrls: ["./match-detail.component.css"]
})
export class MatchDetailComponent implements OnInit {

  public fixture: Fixture = new Fixture();
  public handicap: Handicap = new Handicap();
  public match: Match = new Match();

  public account: string;

  constructor(
    private _route: ActivatedRoute,
    private _router: Router,
    private _web3Service: Web3Service,
    private _modalService: BsModalService
  ) {}

  ngOnInit() {
    this._getAccounts();
    this._route.queryParams.subscribe(p => {
      if (p.id) {
        this._setProperties(p);
      } else {
        this._router.navigate(['']);
      }
    });
  }

  private _setProperties(p: any) {
    this.handicap = new Handicap(p);
    this.fixture = new Fixture(p);

    let time = new Date(p.date);
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

  public openHandicap() {
    const _opts = {
      class: 'modal-md',
      initialState: {
        title: 'Handicap',
        btnSubmit: 'Create',
        account: this.account,
        match: this.match,
        fixture: this.fixture,
        handicap: this.handicap
      }
    };

    this._openModalWithComponent(DealModalComponent, _opts);
  }

  public openDeal() {
    const _opts = {
      class: 'modal-md',
      initialState: {
        title: 'Deal',
        btnSubmit: 'Deal',
        account: this.account,
        match: this.match,
        fixture: this.fixture,
        handicap: this.handicap
      }
    };

    this._openModalWithComponent(DealModalComponent, _opts);
  }

  private _openModalWithComponent(comp, opts?: ModalOptions) {
    const subscribe = this._modalService.onHidden.subscribe((res: any) => {
      if (res) {
        console.log(res);
      }

      subscribe.unsubscribe();
    });

    this._modalService.show(DealModalComponent, opts);
  }
}
