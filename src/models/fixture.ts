import { DateTime } from 'luxon';
import { FixtureInterface } from '../interfaces/fixture';
import { FixtureResult } from './fixtureResult';

export class Fixture {

  private _id: number | string;
  public get id(): number | string {
    return this._id;
  }
  public set id(v: number | string) {
    this._id = v;
  }

  public get id_string(): string{
    return ""+this._id;
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
    return DateTime.fromISO(this._date).toFormat('dd/MM/yyyy');
  }
  public get time_string(): string {
    return DateTime.fromISO(this._date).toFormat('HH:mm a');
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

  private _awayFlag: string;
  public get awayFlag(): string {
    return this._awayFlag;
  }
  public set awayFlag(v: string) {
    this._awayFlag = v;
  }

  private _homeFlag: string;
  public get homeFlag(): string {
    return this._homeFlag;
  }
  public set homeFlag(v: string) {
    this._homeFlag = v;
  }

  public get match(): string {
    return `${this.homeTeamName} - ${this.awayTeamName}`;
  }

  private _result : FixtureResult;
  public get result() : FixtureResult {
    return this._result;
  }
  public set result(v : FixtureResult) {
    this._result = v;
  }

  public get isFinished(): boolean{
    return this.status === "FINISHED";
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
      this.status        = data.status;
      this.awayFlag      = data.awayFlag;
      this.homeFlag      = data.homeFlag;
      this.result        = data.result;
    }
  }

  public pickJson() {
    return {
      id: this.id,
      competitionId: this.competitionId,
      homeTeamId: this.homeTeamId,
      awayTeamId: this.awayTeamId,
      homeTeamName: this.homeTeamName,
      awayTeamName: this.awayTeamName,
      date: this.date,
      status: this.status,
      awayFlag: this.awayFlag,
      homeFlag: this.homeFlag,
      result: this.result
    };
  }
}
