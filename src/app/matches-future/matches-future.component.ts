import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import { JhelperService, Web3Service, NotifyService, EventEmitterService } from 'service/service';

import { Fixture } from 'models/fixture';
import { METAMASK } from 'enums/metamask';

import * as groupBy from 'lodash/groupBy';
import * as map from 'lodash/map';
import * as moment from 'moment';

@Component({
  selector: 'app-matches-future',
  templateUrl: './matches-future.component.html',
  styleUrls: ['./matches-future.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MatchesFutureComponent implements OnInit {

  private _fixtures: Fixture[] = [];
  public matchFixtures: Array<Object> = [];

  private _currentDate: moment.Moment;

  constructor(
    private _router: Router,
    private _zone: NgZone,
    private _web3Service: Web3Service,
    private _helper: JhelperService,
    private _notify: NotifyService,
    private _cd: ChangeDetectorRef,
    private _eventEmitter: EventEmitterService
  ) {
    this._currentDate = moment().local().add(2, 'd');
  }

  ngOnInit() {
    this.fetch();
  }

  public fetch(): any {
    this._fixtures = [];

    this._helper.fetchFixtures()
      .subscribe((res: any) => {
        res.fixtures.map(fixture => {
          if (!!fixture.homeTeamName && !!fixture.awayTeamName && fixture.status !== 'FINISHED' && this._currentDate.isSameOrBefore(fixture.date, 'day')) {
            const _fixture = new Fixture(fixture);
            if (!!this._web3Service.web3) {
              _fixture.id = this._helper.hashId(fixture.homeTeamName, fixture.awayTeamName, fixture.date);
            }

            _fixture.homeFlag = '/assets/images/flag/Flag_of_' + _fixture.homeTeamNameWithUnderScore + '.svg';
            _fixture.awayFlag = '/assets/images/flag/Flag_of_' + _fixture.awayTeamNameWithUnderScore + '.svg';
            this._fixtures.push(_fixture);
          }
        });

        this.matchFixtures = map(
          groupBy(this._fixtures, 'date_string', ['asc']),
          (value, key) => ({
            key,
            value: [...value]
          })
        );
        this._cd.markForCheck();
      }, (errors: any) => {
        this._notify.error(errors);
      }
    );
  }

  public gotoDetail(fixture?: Fixture) {
    if (!this._web3Service.web3) {
      this._eventEmitter.publishData({ type: METAMASK.INSTALL });
    } else {
      this._web3Service.getAccounts()
        .subscribe(() => this._zone.run(() => {
          this._router.navigate(['/match-detail'], { queryParams: fixture.pickJson() });
        }), () => {
          this._eventEmitter.publishData({ type: METAMASK.LOGIN });
        });
    }
  }
}
