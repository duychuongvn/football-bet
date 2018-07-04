import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { JhelperService, NotifyService } from 'service/service';

import { Fixture } from 'models/fixture';

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
  public set currentDate(v: moment.Moment ) {
    this._currentDate = v;
  }

  constructor(
    private _helper: JhelperService,
    private _notify: NotifyService,
    private _cd: ChangeDetectorRef
  ) {
    this._currentDate = moment().local().add(1, 'd');
  }

  ngOnInit() {
    this.fetch();
  }

  public fetch(): any {
    this.fixtures = [];

    this._helper.fetchFixtures()
      .subscribe((res: any) => {
        res.fixtures.map(fixture => {
          if (!!fixture.homeTeamName && !!fixture.awayTeamName && fixture.status !== 'FINISHED' && this.currentDate.isSame(fixture.date, 'day')) {
             let fixtureId = this._helper.hashId(fixture.homeTeamName, fixture.awayTeamName, fixture.date);
             let _fixture = new Fixture(fixture);
             _fixture.id = fixtureId;

             _fixture.homeFlag = "/assets/images/flag/Flag_of_"+_fixture.homeTeamNameWithUnderScore+".svg";
             _fixture.awayFlag = "/assets/images/flag/Flag_of_"+_fixture.awayTeamNameWithUnderScore+".svg";
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
}
