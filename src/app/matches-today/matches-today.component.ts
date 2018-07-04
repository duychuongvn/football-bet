import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { JhelperService, NotifyService } from 'service/service';

import { Fixture } from 'models/fixture';

import * as orderBy from 'lodash/orderBy';
import * as moment from 'moment';

@Component({
  selector: 'app-matches-today',
  templateUrl: './matches-today.component.html',
  styleUrls: ['./matches-today.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MatchesTodayComponent implements OnInit {

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
    private _router: Router,
    private _helper: JhelperService,
    private _notify: NotifyService,
    private _cd: ChangeDetectorRef
  ) {
    this._currentDate = moment().local();
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

        if (!this.fixtures[0]) {
          this._router.navigate(['/tomorrow']);
          this._notify.warning('No matches found!');
        } else {
          this.fixtures = orderBy(this.fixtures, ['date_string'], ['asc']);

          this._cd.markForCheck();
        }
      }, (errors: any) => {
        this._notify.error(errors);
      }
    );
  }
}
