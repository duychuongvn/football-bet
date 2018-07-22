import { OnInit, Injectable } from '@angular/core';
import { JhelperService } from 'service/service';

import { Fixture } from 'models/fixture';

import * as moment from 'moment';

import { FixturesData } from './mockData';

@Injectable()
export abstract class HomeBaseComponent implements OnInit {

  protected fixtures: Fixture[] = [];

  private _currentDate: moment.Moment;
  protected get currentDate(): moment.Moment {
    return this._currentDate;
  }

  protected get currentDateString(): string {
    return this._currentDate.format('LL [(]dddd[)]');
  }

  protected set currentDate(v: moment.Moment) {
    this._currentDate = v;
  }

  constructor(
    protected helper: JhelperService
  ) {}

  ngOnInit() {
    this._fetch();
  }

  private _fetch() {
    FixturesData.map(item => {

      item.bettings.map((bet: any) => {
        bet.hashId = this.helper.hashId(bet.homeTeam, bet.awayTeam, bet.date);
      });

      this.fixtures.push(new Fixture(item));
    });
  }

  // public gotoDetail(fixture?: Fixture) {
  //   if (!this._web3Service.web3) {
  //     this._eventEmitter.publishData({ type: METAMASK.INSTALL });
  //   } else {
  //     this._web3Service.getAccounts()
  //       .subscribe(() => this._zone.run(() => {
  //         this._matchesService.reqData = fixture.pickJson();
  //         this._router.navigate(['/match-detail']);

  //       }), () => {
  //         this._eventEmitter.publishData({ type: METAMASK.LOGIN });
  //       });
  //   }
  // }
}
