import { FixtureInterface, TeamInterface, DiffCurrentDate } from '@/shared/interfaces/fixture'
import { BaseModel } from '@/shared/model/base-model';
import { Team } from '@/shared/model/team';
import { Sumary } from '@/shared/model/sumary';
import { Web3Vue } from '@/shared/services/web3.service';

import { DateTime, Interval } from 'luxon';

export class Fixture extends BaseModel{

  private _date!: string;
  private _leagueName: any;
  get leagueName(): any {
    return this._leagueName;
  }

  set leagueName(value: any) {
    this._leagueName = value;
  }
  get date(): string {
    return this._date;
  }
  set date(v: string) {
    this._date = v;
  }

  get dateCountDown(): string {
    return DateTime.fromISO(this._date).toFormat('yyyy/MM/dd HH:mm:ss');
  }
  get dateString(): string {
    return DateTime.fromISO(this._date).toLocaleString(DateTime.DATE_MED);
  }
  get timeString(): string {
    return DateTime.fromISO(this._date).toLocaleString({weekday: 'long', hour: '2-digit', minute: '2-digit'});
  }
  get dateTimeString(): string {
    return DateTime.fromISO(this.date).toLocaleString(DateTime.DATETIME_MED);
  }
  get isGoLive(): boolean {
    return Interval.fromISO(this.date).isBefore(DateTime.local());
  }

  private _status!: string;
  get status(): string {
    return this._status;
  }
  set status(v: string) {
    this._status = v;
  }

  private _homeTeam!: Team;
  get homeTeam(): Team {
    return this._homeTeam;
  }
  set homeTeam(v: Team) {
    this._homeTeam = v;
  }

  private _awayTeam!: Team;
  get awayTeam(): Team {
    return this._awayTeam;
  }
  set awayTeam(v: Team) {
    this._awayTeam = v;
  }

  get fixtureName(): string {
    return `${this.homeTeam.name} ~ ${this.awayTeam.name}`;
  }
  get matchId(): string {
    return Web3Vue.generateMatchId(
      this.homeTeam.name,
      this.awayTeam.name,
      this.leagueName)
  }

  get diffCurrentDate(): DiffCurrentDate {
    return DateTime.fromISO(this.date).diffNow(['days']).toObject();
  }

  get isToDay(): boolean {
    return DateTime.fromISO(this.date).hasSame(DateTime.utc(), 'days');
  }
  get isTomorrow(): boolean {
    return DateTime.fromISO(this.date).hasSame(DateTime.utc().plus({ 'days': 1 }), 'days');
  }
  get isFuture(): boolean {
    return !!this.diffCurrentDate.days && this.diffCurrentDate.days >= 2;
  }

  private _summary!: Sumary;
  public get summary(): Sumary {
    return this._summary;
  }
  public set summary(v: Sumary) {
    this._summary = v;
  }

  private _approved!: boolean;
  get approved(): boolean {
    return this._approved;
  }
  set approved(v: boolean) {
    this._approved = v;
  }

  private _homeGoals!: number;
  get homeGoals(): number {
    return this._homeGoals;
  }
  set homeGoals(v: number) {
    this._homeGoals = v;
  }

  private _awayGoals!: number;
  get awayGoals(): number {
    return this._awayGoals;
  }
  set awayGoals(v: number) {
    this._awayGoals = v;
  }

  private _isRequestPayout!: boolean;
  get isRequestPayout(): boolean {
    return this._isRequestPayout;
  }
  set isRequestPayout(v: boolean) {
    this._isRequestPayout = v;
  }

  get key(): string {
    return btoa(JSON.stringify({
      id: this.id,
      matchId: this.matchId,
      date: this.date,
      homeTeam: this.homeTeam.toJson,
      awayTeam: this.awayTeam.toJson
    }));
  }

  get toJson() {
    return {
      id: this.id,
      date: this.date,
      homeTeam: this.homeTeam.name,
      awayTeam: this.awayTeam.name,
      matchId:this.matchId,
    }
  }

  constructor (fixture: FixtureInterface) {
    super(fixture);

    this.summary = new Sumary();

    if (fixture) {
      this.date      = fixture.date;
      this.status    = fixture.status;
      this.homeTeam  = new Team(fixture.homeTeam);
      this.awayTeam  = new Team(fixture.awayTeam);
      this.approved  = fixture.approved;
      this.homeGoals = fixture.homeGoals;
      this.awayGoals = fixture.awayGoals;
      this.leagueName = 'PREMIER LEAGUE';

      console.log("fixture.leagueName",fixture.leagueName)
    }
  }
}
