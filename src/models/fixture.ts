import { BaseModel } from './base';
import { NewFixtureInterface } from 'interfaces/fixture';
import { NewBettingInterface } from 'interfaces/betting';

import { Betting } from './betting';

import * as moment from 'moment';

export class Fixture extends BaseModel {

  private _name: string;
  public get name(): string {
    return this._name;
  }
  public set name(v: string) {
    this._name = v;
  }

  private _date: string;
  public get date(): string {
    return this._date;
  }
  public set date(v: string) {
    this._date = v;
  }

  private _bettings: NewBettingInterface[];
  public get bettings(): NewBettingInterface[] {
    return this._bettings;
  }
  public set bettings(v: NewBettingInterface[]) {
    this._bettings = v;
  }

  constructor (data?: NewFixtureInterface) {
    super(data);

    this.bettings = [];

    if (data) {
      this.name = data.name;
      this.date = data.date;

      if (data.bettings) {
        this._addBettings(data.bettings);
      }
    }
  }

  public _addBettings(bettings: Array<Object>) {
    let _bettings = [];

    bettings.map((betting: NewBettingInterface) => _bettings.push(new Betting(betting)));

    this.bettings = _bettings;
  }
}
