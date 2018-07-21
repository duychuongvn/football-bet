import { BaseModel } from './base';
import { NewBettingInterface } from 'interfaces/betting';

import * as moment from 'moment';

export class Betting extends BaseModel {

  private _date: string;
  public get date(): string {
    return this._date;
  }
  public get dateString(): string {
    return moment(this._date, 'YYYY/MM/DD').format('LL [(]dddd[)]');
  }
  public get dateBetting(): string {
    return moment(this._date, 'YYYY/MM/DD').format('LL [(]dddd[)] - HH:mm a');
  }
  public get timeString(): string {
    return moment(this._date, 'YYYY/MM/DD').format('HH:mm a');
  }
  public set date(v: string) {
    this._date = v;
  }

  private _homeTeam: string;
  public get homeTeam(): string {
    return this._homeTeam;
  }
  public get homeTeamFlag(): string {
    return `/assets/images/flag/Flag_of_${this.homeTeam}.svg`;
  }
  public set homeTeam(v: string) {
    this._homeTeam = v;
  }

  private _awayTeam: string;
  public get awayTeam(): string {
    return this._awayTeam;
  }
  public get awayTeamFlag(): string {
    return `/assets/images/flag/Flag_of_${this.awayTeam}.svg`;
  }
  public set awayTeam(v: string) {
    this._awayTeam = v;
  }

  public get bettingName(): string {
    return `${this.homeTeam} ~ ${this.awayTeam}`;
  }

  public get gotoDetail(): Object {
    return {
      id: this.id,
      homeTeam: this.homeTeam,
      awayTeam: this.awayTeam,
      date: this.date
    };
  }

  constructor (data?: NewBettingInterface) {
    super(data);

    if (data) {
      this.homeTeam = data.homeTeam;
      this.awayTeam = data.awayTeam;
      this.date     = data.date;
    }
  }
}
