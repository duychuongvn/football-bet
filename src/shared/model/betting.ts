import { BettingInterface } from '@/shared/interfaces/betting'
import { PunterInterface } from '@/shared/interfaces/punter';

import { Punter } from './punter';

export class Betting {

  protected _id: number = 0;
  public get id(): number {
    return this._id;
  }
  public set id(v: number) {
    this._id = v;
  }

  protected _bettingId: number = 0;
  public get bettingId(): number {
    return this._bettingId;
  }
  public set bettingId(v: number) {
    this._bettingId = v;
  }

  protected _bookmakerAddress: string = '';
  public get bookmakerAddress(): string {
    return this._bookmakerAddress;
  }
  public set bookmakerAddress(v: string) {
    this._bookmakerAddress = v;
  }

  protected _bookmakerAmount: number = 0;
  public get bookmakerAmount(): number {
    return this._bookmakerAmount;
  }
  public get bookmakerAmountString(): string {
    return `${this._bookmakerAmount.toFixed(3)} ETH`;
  }
  public set bookmakerAmount(v: number) {
    this._bookmakerAmount = v;
  }

  protected _bookmakerTeam: number = 0;
  public get bookmakerTeam(): number {
    return this._bookmakerTeam;
  }
  public set bookmakerTeam(v: number) {
    this._bookmakerTeam = v;
  }

  protected _matchId: any;
  public get matchId(): any {
    return this._matchId;
  }
  public set matchId(v: any) {
    this._matchId = v;
  }

  protected _odds: number = 0;
  public get odds(): number {
    return this._odds;
  }
  public set odds(v: number) {
    this._odds = v;
  }

  protected _settledAmount: number = 0;
  public get settledAmount(): number {
    return this._settledAmount;
  }
  public get settledAmountString(): string {
    return `${this.settledAmount.toFloatString(3)} ETH`;
  }
  public set settledAmount(v: number) {
    this._settledAmount = v;
  }

  public get openAmount(): string {
    const _openAmount = this.bookmakerAmount.big().minus(this.settledAmount.big());
    return `${_openAmount.toFixed(3)} ETH`;
  }

  protected _status: number = 0;
  public get status(): number {
    return this._status;
  }
  public set status(v: number) {
    this._status = v;
  }
  // @ts-ignore
  public get statusString(): string {
    switch (+this.status) {
      case 0:
        return 'Open';
      case 1:
        return 'Deal';
      case 2:
        return 'Settled';
      case 3:
        return 'Canceled';
      case 4:
        return 'Refunded';
      case 5:
        return 'Done';
    }
  }

  protected _punters: PunterInterface[] = [];
  public get punters(): PunterInterface[] {
    return this._punters;
  }
  public set punters(v: PunterInterface[]) {
    this._punters = v;
  }

  protected _account: string = '';
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

  protected _addPunters(punters: PunterInterface[]) {
    const _punters: PunterInterface[] = [];

    punters.map((punter: PunterInterface) => _punters.push(new Punter(punter)));

    this.punters = _punters;
  }
}
