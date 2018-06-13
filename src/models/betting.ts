import { BettingInterface } from 'interfaces/betting'

import { Handicap } from './handicap'

export class Betting {
  private _status: number;
  public get status(): number {
    return this._status;
  }
  public set status(v: number) {
    this._status = v;
  }

  private _stake: number;
  public get stake(): number {
    return this._stake;
  }
  public set stake(v: number) {
    this._stake = v;
  }

  private _odds: string | number;
  public get odds(): string | number {
    return this._odds;
  }
  public get odds_string(): string {
    return Handicap.oddsArray.find((item: any) => +item.id === this.odds)['value'];
  }
  public set odds(v: string | number) {
    this._odds = v;
  }

  private _dealer: string;
  public get dealer(): string {
    return (this._dealer === "0x0000000000000000000000000000000000000000")?"":this._dealer;
  }
  public set dealer(v: string) {
    this._dealer = v;
  }

  private _bettingId: string | number;
  public get bettingId(): string | number {
    return this._bettingId;
  }
  public set bettingId(v: string | number) {
    this._bettingId = v;
  }

  private _matchId: string | number;
  public get matchId(): string | number {
    return this._matchId;
  }
  public set matchId(v: string | number) {
    this._matchId = v;
  }

  private _amount: number;
  public get amount(): number {
    return this._amount;
  }
  public set amount(v: number) {
    this._amount = v;
  }

  private _offer: string;
  public get offer(): string {
    return (this._offer === "0x0000000000000000000000000000000000000000")?"":this._offer;
  }
  public set offer(v: string) {
    this._offer = v;
  }


  private _pair : number;
  public get pair() : number {
    return this._pair;
  }
  public set pair(v : number) {
    this._pair = v;
  }



  constructor(data?: BettingInterface) {
    if (data) {
      this.bettingId = data.bettingId;
      this.matchId   = data.matchId;
      this.amount    = data.amount;
      this.offer     = data.offer;
      this.dealer    = data.dealer;
      this.odds      = data.odds;
      this.stake     = data.stake;
      this.status    = data.status;
      this.pair      = data.pair;
    }
  }
}
