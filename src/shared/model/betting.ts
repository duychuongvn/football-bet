import { BettingInterface } from '@/shared/interfaces/betting'
import { PunterInterface } from '@/shared/interfaces/punter';

import { Punter } from './punter';

const isNaN = require('lodash.isnan');
const isUndefined = require('lodash.isundefined');

export class Betting {
  // 0: None, 1: Win, 2: WinAHalf, 3: Draw, 4:LoseAHalf, 5:Lose
  private _bookmakerResult: number = 0;
  public get bookmakerResult(): number {
    return this._bookmakerResult;
  }
  public set bookmakerResult(value: number) {
    this._bookmakerResult = value;
  }
  public get bookmakerResultString(): string {
      if (+this.status <= 2) { // not approve
        if (+this.settledAmount === 0 || +this.bookmakerResult >= 3) { // no-settle - draw - lose a half - lose full
          return 'Waiting for Refund';
        }

        if (+this.bookmakerResult === 1 || +this.bookmakerResult === 2) { // Win - win a half
          return 'Waiting for Payment';
        }
      }
      return 'Paid';
  }

  protected _id: any;
  public get id(): any {
    return this._id;
  }
  public set id(v: any) {
    this._id = v;
  }

  protected _bettingId: any;
  public get bettingId(): any {
    return this._bettingId;
  }
  public set bettingId(v: any) {
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
        return (this.punters.length === 0) ? 'Settled' : 'Partially Settled';
      case 2:
        return 'Settled';
      case 3:
        return 'Canceled';
      case 4:
        return 'Refunded';
      case 5:
        return 'Paid';
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

  public get isDisabled(): boolean {
    return this.status > 0 || isNaN(this.bettingId) || isUndefined(this.bettingId);
  }

  public get isDisabledShare(): boolean {
    return this.status > 1 || isNaN(this.bettingId) || isUndefined(this.bettingId);
  }

  private _returnedAmount: number | string = 0;
  public get returnedAmount(): number | string {
    return this._returnedAmount;
  }
  public set returnedAmount(value: number | string) {
    this._returnedAmount = value;
  }

  private _isSelected: boolean = false;
  public get isSelected(): boolean {
    return this._isSelected;
  }
  public set isSelected(value: boolean) {
    this._isSelected = value;
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
      this.bookmakerResult  = +betting.bookmakerResult;
      this.returnedAmount   = betting.returnedAmount;

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
