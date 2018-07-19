import { BaseModel } from './base';
import { UserOdds } from './user-odds';

import { UserOddsInterface } from 'interfaces/user-odds';
import { UserInterface } from 'interfaces/user';

import * as moment from 'moment';

export class User extends BaseModel {

  private _name : string;
  public get name() : string {
    return this._name;
  }
  public set name(v : string) {
    this._name = v;
  }

  private _date : string;
  public get date() : string {
    return this._date;
  }
  public get month(): string {
    return moment(this.date, 'YYYY/MM/DD').format('MMM');
  }
  public get day(): string {
    return moment(this.date, 'YYYY/MM/DD').format('DD');
  }
  public set date(v : string) {
    this._date = v;
  }

  private _odds : UserOdds[];
  public get odds() : UserOdds[] {
    return this._odds;
  }
  public set odds(v : UserOdds[]) {
    this._odds = v;
  }

  constructor(data?: UserInterface) {
    super(data);

    if (data) {
      this.name = data.name;
      this.date = data.date;

      if (data.odds) {
        this.addUserMatches(data.odds);
      }
    }
  }

  public addUserMatches(d: Array<Object>) {
    let _odds = [];
    d.map((item: UserOddsInterface) => {
      _odds.push(new UserOdds(item));
    });

    this.odds = _odds;
  }
}
