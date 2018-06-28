import { MatchInterface } from 'interfaces/match'
import { Betting } from 'models/betting'
import * as moment from 'moment';

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
    return moment(new Date(this.time * 1000).toISOString()).format('ff');
    //  return DateTime.fromISO(this.time * 1000).toFormat('dd/MM/yyyy');
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

  private _matchId: any;
  public get matchId(): any {
    return this._matchId;
  }
  public set matchId(v: any) {
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



  private _approved : boolean;
  public get approved() : boolean {
    return this._approved;
  }
  public set approved(v : boolean) {
    this._approved = v;
  }

  private _openBet: number;
  private _settledBet: number;
  private _totalBet: number;

  constructor(data?: MatchInterface) {
    this.totalBet = 0;
    this.openBet = 0;
    this.settledBet = 0;
    if (data) {
      this.matchId = data.matchId;
      this.homeTeam = data.homeTeam;
      this.awayTeam = data.awayTeam;
      this.homeGoals = data.homeGoals;
      this.awayGoals = data.awayGoals;
      this.status = data.status;
      this.time = data.time;
      this.bettings = data.bettings;
      this.approved = data.approved;
    }
  }

  get openBet(): number {
    return this._openBet;
  }

  set openBet(value: number) {
    this._openBet = value;
  }

  get settledBet(): number {
    return this._settledBet;
  }

  set settledBet(value: number) {
    this._settledBet = value;
  }

  get totalBet(): number {
    return this._totalBet;
  }

  set totalBet(value: number) {
    this._totalBet = value;
  }
}
