import { BettingInterface } from "interfaces/betting";

import { Handicap } from "./handicap";

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

  public get odds_number(): number {
    if (this.selectedTeam === 0) {
      return +this._odds / 100;
    } else {
      return 0 - +this._odds / 100;
    }
  }

  public get odds_string(): string {
    if (this.selectedTeam === 0) {
      return Handicap.oddsArray.find((item: any) => +item.id === +this.odds)[
        "value"
      ];
    } else {
      let oddsArray = Handicap.oddsArray
        .find((item: any) => +item.id === +this.odds)
        ["value"].split(":");
      return oddsArray[1] + ":" + oddsArray[0];
    }
  }
  public set odds(v: string | number) {
    this._odds = v;
  }

  private _dealer: string;
  public get dealer(): string {
    return this._dealer === "0x0000000000000000000000000000000000000000"
      ? ""
      : this._dealer;
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

  private _matchId: any;
  public get matchId(): any {
    return this._matchId;
  }
  public set matchId(v: any) {
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
    return this._offer === "0x0000000000000000000000000000000000000000"
      ? ""
      : this._offer;
  }
  public set offer(v: string) {
    this._offer = v;
  }

  private _selectedTeam: number;
  public get selectedTeam(): number {
    return this._selectedTeam;
  }
  public set selectedTeam(v: number) {
    this._selectedTeam = v;
  }

  private _homeOffer: string;
  public get homeOffer(): string {
    return this._homeOffer;
  }
  public set homeOffer(v: string) {
    this._homeOffer = v;
  }

  private _awayOffer: string;
  public get awayOffer(): string {
    return this._awayOffer;
  }
  public set awayOffer(v: string) {
    this._awayOffer = v;
  }

  private _homeDealer: string;
  public get homeDealer(): string {
    return this._homeDealer;
  }
  public set homeDealer(v: string) {
    this._homeDealer = v;
  }

  private _awayDealer: string;
  public get awayDealer(): string {
    return this._awayDealer;
  }
  public set awayDealer(v: string) {
    this._awayDealer = v;
  }

  constructor(data?: BettingInterface) {
    if (data) {
      this.bettingId = data.bettingId;
      this.matchId = data.matchId;
      this.amount = data.amount;
      this.offer = data.offer;
      this.dealer = data.dealer;
      this.odds = data.odds;
      this.stake = data.stake;
      this.status = data.status;
      this.selectedTeam = data.selectedTeam;
    }
  }
}
