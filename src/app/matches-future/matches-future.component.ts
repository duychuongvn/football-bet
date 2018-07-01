import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';

import { JhelperService, NotifyService } from 'service/service';

import { Fixture } from 'models/fixture';

import * as groupBy from 'lodash/groupBy';
import * as map from 'lodash/map';
import * as moment from 'moment';

@Component({
  selector: 'app-matches-future',
  templateUrl: './matches-future.component.html',
  styleUrls: ['./matches-future.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MatchesFutureComponent implements OnInit {

  private _fixtures: Fixture[] = [];
  public matchFixtures: Array<Object> = [];

  private _currentDate: moment.Moment;

  constructor(
    private _helper: JhelperService,
    private _notify: NotifyService,
    private _cd: ChangeDetectorRef
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
          if (!!fixture.homeTeamName && !!fixture.awayTeamName && fixture.status !== 'FINISHED' && this._currentDate.isAfter(fixture.date, 'day')) {
             let fixtureId = this._helper.hashId(fixture.homeTeamName, fixture.awayTeamName, fixture.date);
             let _fixture = new Fixture(fixture);
             _fixture.id = fixtureId;

             _fixture.homeFlag = "/assets/images/flag/Flag_of_"+_fixture.homeTeamNameWithUnderScore+".svg";
             _fixture.awayFlag = "/assets/images/flag/Flag_of_"+_fixture.awayTeamNameWithUnderScore+".svg";
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

}
