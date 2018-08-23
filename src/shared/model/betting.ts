import { BettingInterface } from '@/shared/interfaces/betting'
import { PunterInterface } from '@/shared/interfaces/punter';

import { Punter } from './punter';

export class Betting {

  private _id: number = 0;
  public get id(): number {
    return this._id;
  }
  public set id(v: number) {
    this._id = v;
  }

  private _bettingId: number = 0;
  public get bettingId(): number {
    return this._bettingId;
  }
  public set bettingId(v: number) {
    this._bettingId = v;
  }

  private _bookmakerAddress: string = '';
  public get bookmakerAddress(): string {
    return this._bookmakerAddress;
  }
  public set bookmakerAddress(v: string) {
    this._bookmakerAddress = v;
  }

  private _bookmakerAmount: number = 0;
  public get bookmakerAmount(): number {
    return this._bookmakerAmount;
  }
  public set bookmakerAmount(v: number) {
    this._bookmakerAmount = v;
  }

  private _bookmakerTeam: number = 0;
  public get bookmakerTeam(): number {
    return this._bookmakerTeam;
  }
  public set bookmakerTeam(v: number) {
    this._bookmakerTeam = v;
  }

  private _matchId: any;
  public get matchId(): any {
    return this._matchId;
  }
  public set matchId(v: any) {
    this._matchId = v;
  }

  private _odds: number = 0;
  public get odds(): number {
    return this._odds;
  }
  public set odds(v: number) {
    this._odds = v;
  }

  private _settledAmount: number = 0;
  public get settledAmount(): number {
    return this._settledAmount;
  }
  public set settledAmount(v: number) {
    this._settledAmount = v;
  }

  public get openAmount(): string {
    const _openAmount = this.bookmakerAmount - this.settledAmount;
    return `${_openAmount} ETH`;
  }

  private _status: number = 0;
  public get status(): number {
    return this._status;
  }
  public set status(v: number) {
    this._status = v;
  }

  private _punters: PunterInterface[] = [];
  public get punters(): PunterInterface[] {
    return this._punters;
  }
  public set punters(v: PunterInterface[]) {
    this._punters = v;
  }

  private _account: string = '';
  public get account(): string {
    return this._account;
  }
  public set account(v: string) {
    this._account = v;
  }

  public get isOwner(): boolean {
    return this.account === this.bookmakerAddress;
  }

  constructor(betting: BettingInterface) {

    if (betting) {
      this.id               = betting.id;
      this.bettingId        = betting.bettingId;
      this.bookmakerAddress = betting.bookmakerAddress;
      this.bookmakerAmount  = +betting.bookmakerAmount;
      this.bookmakerTeam    = betting.bookmakerTeam;
      this.matchId          = betting.matchId;
      this.odds             = betting.odds;
      this.settledAmount    = +betting.settledAmount;
      this.status           = +betting.status;

      if (betting.punters) {
        this._addPunters(betting.punters);
      }
    }
  }

  private _addPunters(punters: PunterInterface[]) {
    const _punters: PunterInterface[] = [];

    punters.map((punter: PunterInterface) => _punters.push(new Punter(punter)))

    this.punters = _punters;
  }
}
