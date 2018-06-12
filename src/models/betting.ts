import {BettingInterface} from 'interfaces/betting'

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
  public set odds(v: string | number) {
    this._odds = v;
  }

  private _punterAddress: string;
  public get punterAddress(): string {
    return this._punterAddress;
  }
  public set punterAddress(v: string) {
    this._punterAddress = v;
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

  private _bookmarkerAddress: string;
  public get bookmarkerAddress(): string {
    return this._bookmarkerAddress;
  }
  public set bookmarkerAddress(v: string) {
    this._bookmarkerAddress = v;
  }




  constructor(data?: BettingInterface){
    if(data){
      this.bettingId = data.bettingId;
      this.matchId = data.matchId;
      this.bookmarkerAddress = data.bookmarkerAddress;
      this.punterAddress = data.punterAddress;
      this.odds = data.odds;
      this.stake = data.stake;
      this.status = data.status;
    }
  }
}
