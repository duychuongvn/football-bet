import { HandicapInterface } from "interfaces/handicap";
import { DateTime } from "luxon";

export class Handicap {


private _selectedPair : string;
public get selectedPair() : string {
  return this._selectedPair;
}
public set selectedPair(v : string) {
  this._selectedPair = v;
}


  private _id: number | string;
  public get id(): number | string {
    return this._id;
  }
  public set id(v: number | string) {
    this._id = v;
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



private _pairs : any[];
public get pairs() : any[] {
  return this._pairs;
}
public set pairs(v : any[]) {
  this._pairs = v;
}


  public get date_string(): string {
    return DateTime.fromISO(this._date).toFormat('f');
  }

  constructor(data?: HandicapInterface) {
    if (data) {
      this.id = data.id;
      this.odds = data.odds;
      this.pairs = data.pairs;
      this.stake = data.stake;
      this.date = data.date;
      this.selectedPair = data.selectedPair;
    }
  }
}
