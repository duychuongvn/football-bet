import { DateTime } from 'luxon';
import { FixtureInterface } from 'interface/fixture';

export class Fixture {

  private _id: number;
  public get id(): number {
    return this._id;
  }
  public set id(v: number) {
    this._id = v;
  }

  private _competitionId: number;
  public get competitionId(): number {
    return this._competitionId;
  }
  public set competitionId(v: number) {
    this._competitionId = v;
  }

  private _homeTeamId: number;
  public get homeTeamId(): number {
    return this._homeTeamId;
  }
  public set homeTeamId(v: number) {
    this._homeTeamId = v;
  }

  private _homeTeamName: string;
  public get homeTeamName(): string {
    return this._homeTeamName;
  }
  public set homeTeamName(v: string) {
    this._homeTeamName = v;
  }

  private _awayTeamId: number;
  public get awayTeamId(): number {
    return this._awayTeamId;
  }
  public set awayTeamId(v: number) {
    this._awayTeamId = v;
  }

  private _awayTeamName: string;
  public get awayTeamName(): string {
    return this._awayTeamName;
  }
  public set awayTeamName(v: string) {
    this._awayTeamName = v;
  }

  private _date: string;
  public get date(): string {
    return this._date;
  }
  public get date_string(): string {
    return DateTime.fromISO(this._date).toFormat('f');
  }
  public set date(v: string) {
    this._date = v;
  }

  private _status: string;
  public get status(): string {
    return this._status;
  }
  public set status(v: string) {
    this._status = v;
  }

  public get match(): string {
    return `${this.homeTeamName} - ${this.awayTeamName}`;
  }

  constructor(data?: FixtureInterface) {
    if (data) {
      this.id            = data.id;
      this.competitionId = data.competitionId;
      this.homeTeamId    = data.homeTeamId;
      this.homeTeamName  = data.homeTeamName;
      this.awayTeamId    = data.awayTeamId;
      this.awayTeamName  = data.awayTeamName;
      this.date          = data.date;
      this.status        = data.status
    }
  }
}
