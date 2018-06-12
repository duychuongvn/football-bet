import { MatchInterface } from 'interfaces/match'
import { Betting } from 'models/betting'

export class Match {
  private _status: number;
  public get status(): number {
    return this._status;
  }
  public set status(v: number) {
    this._status = v;
  }

  private _time: number;
  public get time(): number {
    return this._time;
  }
  public get date_from_time() {
    return new Date(this.time);
  }
  public set time(v: number) {
    this._time = v;
  }

  private _awayGoals: number;
  public get awayGoals(): number {
    return this._awayGoals;
  }
  public set awayGoals(v: number) {
    this._awayGoals = v;
  }

  private _matchId: string | number;
  public get matchId(): string | number {
    return this._matchId;
  }
  public set matchId(v: string | number) {
    this._matchId = v;
  }

  private _homeTeam: string;
  public get homeTeam(): string {
    return this._homeTeam;
  }
  public set homeTeam(v: string) {
    this._homeTeam = v;
  }

  private _awayTeam: string;
  public get awayTeam(): string {
    return this._awayTeam;
  }
  public set awayTeam(v: string) {
    this._awayTeam = v;
  }

  private _homeGoals: number;
  public get homeGoals(): number {
    return this._homeGoals;
  }
  public set homeGoals(v: number) {
    this._homeGoals = v;
  }

  private _bettings: Betting[];
  public get bettings(): Betting[] {
    return this._bettings;
  }
  public set bettings(v: Betting[]) {
    this._bettings = v;
  }

  constructor(data?: MatchInterface) {
    if (data) {
      this.matchId = data.matchId;
      this.homeTeam = data.homeTeam;
      this.awayTeam = data.awayTeam;
      this.homeGoals = data.homeGoals;
      this.awayGoals = data.awayGoals;
      this.status = data.status;
      this.time = data.time;
      this.bettings = data.bettings
    }
  }
}
