import { FixtureInterface } from '@/shared/interfaces/fixture'

import * as moment from 'moment';

export class Fixture {
  private _matchId: any;
  public get matchId(): any {
    return this._matchId;
  }
  public set matchId(value: any) {
    this._matchId = value;
  }

  private _summary: any;
  public get summary(): any {
    return this._summary;
  }
  public set summary(value: any) {
    this._summary = value;
  }

  private _id: number = 0;
  public get id(): number {
    return this._id;
  }
  public set id(v: number) {
    this._id = v;
  }

  private _date: string = '';
  public get date(): string {
    return this._date;
  }
  public set date(v: string) {
    this._date = v;
  }
  public get dateCountDown(): string {
    return moment(this.date).format('YYYY/MM/DD HH:mm:ss');
  }
  public get dateString(): string {
    return moment(this.date).format('MMM DD, YYYY');
  }
  public get timeString(): string {
    return moment(this.date).format('ddd - HH:mm a');
  }
  public get dateTimeString(): string {
    return moment(this.date).format('LL [(]dddd[)] - HH:mm a');
  }
  public get isGoLive(): boolean {
    return moment(this.date).isSameOrBefore(new Date());
  }
  public get isFinish(): boolean {
    const _timeBet = moment(this.date).add(2, 'hours').format('YYYY-MM-DD HH:mm:ss');
    const _currentTime = moment().format('YYYY-MM-DD HH:mm:ss');

    return moment(_timeBet).isSameOrBefore(_currentTime);
  }

  private _status: string = '';
  public get status(): string {
    return this._status;
  }
  public set status(v: string) {
    this._status = v;
  }

  private _homeTeam: string = '';
  public get homeTeam(): string {
    return this._homeTeam.toName();
  }
  public get homeTeamFlag(): string {
    return require(`@/assets/images/no-images.png`);
    // return require(`@/assets/flag/${this.homeTeam.toSlug()}.png`);
  }
  public get homeTeamFlag25(): string {
    return `flag-25 ${this.homeTeam.toSlug()}`;
  }
  public get homeTeamFlag50(): string {
    return `flag-50 ${this.homeTeam.toSlug()}`;
  }
  public set homeTeam(v: string) {
    this._homeTeam = v;
  }

  private _awayTeam: string = '';
  public get awayTeam(): string {
    return this._awayTeam.toName();
  }
  public get awayTeamFlag(): string {
    return require(`@/assets/images/no-images.png`);
    // return require(`@/assets/flag/${this.awayTeam.toSlug()}.png`);
  }
  public get awayTeamFlag25(): string {
    return `flag-25 ${this.awayTeam.toSlug()}`;
  }
  public get awayTeamFlag50(): string {
    return `flag-50 ${this.awayTeam.toSlug()}`;
  }
  public set awayTeam(v: string) {
    this._awayTeam = v;
  }
  public get fixtureName(): string {
    return `${this.homeTeam} ~ ${this.awayTeam}`;
  }

  private _isToDay: boolean = false;
  public get isToDay(): boolean {
    return this._isToDay;
  }
  public set isToDay(value: boolean) {
    this._isToDay = value;
  }

  private _isTomorrow: boolean = false;
  public get isTomorrow(): boolean {
    return this._isTomorrow;
  }
  public set isTomorrow(value: boolean) {
    this._isTomorrow = value;
  }

  private _isFuture: boolean = false;
  public get isFuture(): boolean {
    return this._isFuture;
  }
  public set isFuture(value: boolean) {
    this._isFuture = value;
  }

  public get key(): string {
    return btoa(JSON.stringify({
      id: this.id,
      date: this.date,
      homeTeam: this.homeTeam,
      awayTeam: this.awayTeam
    }));
  }

  constructor (fixture: FixtureInterface) {
    if (fixture) {
      this.id       = fixture.id;
      this.date     = fixture.utcDate;
      this.status   = fixture.status;
      this.homeTeam = fixture.homeTeam.name;
      this.awayTeam = fixture.awayTeam.name;
      this.summary = {canceled:0, open:0,portionSettled:0,refuned:0, settledOrDone:0}
    }
  }
}
