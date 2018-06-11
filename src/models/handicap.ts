import { HandicapInterface } from "interfaces/handicap";
import { DateTime } from "luxon";

export class Handicap {
  private _id: number;
  public get id(): number {
    return this._id;
  }
  public set id(v: number) {
    this._id = v;
  }

  private _pairTeam: string;
  public get pairTeam(): string {
    return this._pairTeam;
  }
  public set pairTeam(v: string) {
    this._pairTeam = v;
  }

  private _odds: string;
  public get odds(): string {
    return this._odds;
  }
  public set odds(v: string) {
    this._odds = v;
  }

  private _stake: number;
  public get stake(): number {
    return this._stake;
  }
  public set stake(v: number) {
    this._stake = v;
  }


  private _date : string;
  public get date() : string {
    return this._date;
  }
  public set date(v : string) {
    this._date = v;
  }


  private _inversePairTeam : string;
  public get inversePairTeam() : string {
    return this._inversePairTeam;
  }
  public set inversePairTeam(v : string) {
    this._inversePairTeam = v;
  }

  public get date_string(): string {
    return DateTime.fromISO(this._date).toFormat('f');
  }

  constructor(data?: HandicapInterface) {
    if (data) {
      this.id = data.id;
      this.odds = data.odds;
      this.pairTeam = data.pairTeam;
      this.stake = data.stake;
      this.date = data.date;
      this.inversePairTeam = data.inversePairTeam;
    }
  }
}
