import { BaseModel } from './base';
import { NewBettingInterface } from 'interfaces/betting';

export class Betting extends BaseModel {

  private _date : string;
  public get date() : string {
    return this._date;
  }
  public set date(v : string) {
    this._date = v;
  }

  private _homeTeam : string;
  public get homeTeam() : string {
    return this._homeTeam;
  }
  public get homeTeamFlag() : string {
    return `/assets/images/flag/Flag_of_${this.homeTeam}.svg`;
  }
  public set homeTeam(v : string) {
    this._homeTeam = v;
  }

  private _awayTeam : string;
  public get awayTeam() : string {
    return this._awayTeam;
  }
  public get awayTeamFlag() : string {
    return `/assets/images/flag/Flag_of_${this.awayTeam}.svg`;
  }
  public set awayTeam(v : string) {
    this._awayTeam = v;
  }

  public get bettingName(): string {
    return `${this.homeTeam} ~ ${this.awayTeam}`;
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
