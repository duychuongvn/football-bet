import {Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef, NgZone} from '@angular/core';
import {Router} from '@angular/router';
import {JhelperService, Web3Service, NotifyService, EventEmitterService} from 'service/service';

import {Fixture} from 'models/fixture';
import {METAMASK} from 'enums/metamask';

import * as orderBy from 'lodash/orderBy';
import * as moment from 'moment';

@Component({
  selector: 'app-matches-tomorrow',
  templateUrl: './matches-tomorrow.component.html',
  styleUrls: ['./matches-tomorrow.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MatchesTomorrowComponent implements OnInit {

  public fixtures: Fixture[] = [];

  private _currentDate: moment.Moment;
  public get currentDate(): moment.Moment {
    return this._currentDate;
  }

  public get currentDateString(): string {
    return this._currentDate.format('LL [(]dddd[)]');
  }

  public set currentDate(v: moment.Moment) {
    this._currentDate = v;
  }

  constructor(
    private _router: Router,
    private _zone: NgZone,
    private _web3Service: Web3Service,
    private _helper: JhelperService,
    private _notify: NotifyService,
    private _cd: ChangeDetectorRef,
    private _eventEmitter: EventEmitterService
  ) {
    this.currentDate = moment().local().add(1, 'd');
  }

  ngOnInit() {
    this.fetch();
  }

  public fetch(): any {
    this.fixtures = [];

    this._helper.fetchFixtures()
      .subscribe((res: any) => {
          res.fixtures.map(fixture => {
            if (!!fixture.homeTeamName
              && !!fixture.awayTeamName && fixture.status !== 'FINISHED' && this.currentDate.isSame(fixture.date, 'day')) {
              const fixtureId = this._helper.hashId(fixture.homeTeamName, fixture.awayTeamName, fixture.date);
              const _fixture = new Fixture(fixture);
              _fixture.id = fixtureId;

              _fixture.homeFlag = '/assets/images/flag/Flag_of_' + _fixture.homeTeamNameWithUnderScore + '.svg';
              _fixture.awayFlag = '/assets/images/flag/Flag_of_' + _fixture.awayTeamNameWithUnderScore + '.svg';
              this.fixtures.push(_fixture);
            }
          });

          this.fixtures = orderBy(this.fixtures, ['date_string'], ['asc']);

          this._cd.markForCheck();
        }, (errors: any) => {
          this._notify.error(errors);
        }
      );
  }

  public gotoDetail(fixture?: Fixture) {
    if (!this._web3Service.web3) {
      this._eventEmitter.publishData({type: METAMASK.INSTALL});
    } else {
      this._web3Service.getAccounts()
        .subscribe(() => this._zone.run(() => {
          this._router.navigate(['/match-detail'], {queryParams: fixture.pickJson()});
        }), () => {
          this._eventEmitter.publishData({type: METAMASK.LOGIN});
        });
    }
  }
}
