import { HandicapInterface } from "interfaces/handicap";
import { DateTime } from "luxon";

import { ODDS_TYPE, PAIR_TYPE } from "enums/handicap";
import { parseIntAutoRadix } from "@angular/common/src/i18n/format_number";

export class Handicap {
  public static readonly oddsArray: Array<Object> = [
    { id: "000", value: ODDS_TYPE.ZERO },
    { id: "025", value: ODDS_TYPE.INVERSE_QUARTER },
    { id: "050", value: ODDS_TYPE.INVERSE_HALF },
    { id: "075", value: ODDS_TYPE.INVERSE_THREE_FOURTHS },
    { id: "100", value: ODDS_TYPE.INVERSE_ONE },
    { id: "125", value: ODDS_TYPE.INVERSE_ONE_QUARTER },
    { id: "150", value: ODDS_TYPE.INVERSE_ONE_HALF },
    { id: "175", value: ODDS_TYPE.INVERSE_ONE_THREE_FOURTHS },
    { id: "200", value: ODDS_TYPE.INVERSE_TWO },
    { id: "-025", value: ODDS_TYPE.QUARTER },
    { id: "-050", value: ODDS_TYPE.HALF },
    { id: "-075", value: ODDS_TYPE.THREE_FOURTHS },
    { id: "-100", value: ODDS_TYPE.ONE },
    { id: "-125", value: ODDS_TYPE.ONE_QUARTER },
    { id: "-150", value: ODDS_TYPE.ONE_HALF },
    { id: "-175", value: ODDS_TYPE.ONE_THREE_FOURTHS },
    { id: "-200", value: ODDS_TYPE.TWO }
  ];

  public static readonly oddsArr: Array<Object> = [
    { id: "ZERO", value: "0" },
    { id: "UNDER_QUARTER", value: "+0.25" },
    { id: "UNDER_THREE_A_FOURTHS", value: "+0.75" },
    { id: "UNDER_HALF", value: "+0.5" },
    { id: "UNDER_ONE", value: "+1" },
    { id: "UNDER_ONE_AND_QUARTER", value: "+1.25" },
    { id: "UNDER_ONE_AND_THREE_A_FOURTHS", value: "+1.75" },
    { id: "UNDER_ONE_AND_HALF", value: "+1.5" },
    { id: "UNDER_TWO", value: "+2" },
    { id: "OVER_QUARTER", value: "-0.25" },
    { id: "OVER_THREE_A_FOURTHS", value: "-0.75" },
    { id: "OVER_HALF", value: "-0.5" },
    { id: "OVER_ONE", value: "-1" },
    { id: "OVER_ONE_AND_QUARTER", value: "-1.25" },
    { id: "OVER_ONE_AND_THREE_A_FOURTHS", value: "-1.75" },
    { id: "OVER_ONE_AND_HALF", value: "-1.5" },
    { id: "OVER_TWO", value: "-2" }
  ];

  private _id: number | string;
  public get id(): number | string {
    return this._id;
  }
  public set id(v: number | string) {
    this._id = v;
  }

  public get id_substring(): string {
    return this.id.toString().substr(0, 8);
  }

  private _homeTeamName: string;
  public get homeTeamName(): string {
    return this._homeTeamName;
  }
  public set homeTeamName(v: string) {
    this._homeTeamName = v;
  }

  private _awayTeamName: string;
  public get awayTeamName(): string {
    return this._awayTeamName;
  }
  public set awayTeamName(v: string) {
    this._awayTeamName = v;
  }

  public get pairTeam(): string {
    return `${this.homeTeamName} - ${this.awayTeamName}`;
  }
  public get inversePairTeam(): string {
    return `${this.awayTeamName} - ${this.homeTeamName}`;
  }

  private _odds: string | number;
  public get odds(): string | number {
    return this._odds || Handicap.oddsArr[1]["value"];
  }
  public set odds(v: string | number) {
    this._odds = v;
  }

  public get odds_number(): number {
    return +this.odds;
  }
  private _stake: number;
  public get stake(): number {
    return this._stake || 0.01;
  }
  public set stake(v: number) {
    this._stake = v;
  }

  private _date: string;
  public get date(): string {
    return this._date;
  }
  public set date(v: string) {
    this._date = v;
  }

  public get date_string(): string {
    return DateTime.fromISO(this._date).toFormat("f");
  }

  private _selectedPair: string;
  public get selectedPair(): string {
    return this._selectedPair || PAIR_TYPE.REVERT;
  }
  public set selectedPair(v: string) {
    this._selectedPair = v;
  }

  private _selectedTeam: string;
  public get selectedTeam(): string {
    return this._selectedTeam || "0";
  }
  public set selectedTeam(v: string) {
    this._selectedTeam = v;
  }

  public get teams(): string[] {
    return [this._homeTeamName, this._awayTeamName];
  }

  public get handicapDetail(): string {
    if (this.selectedTeam === "0") {
      return this.homeTeamName + " " + this.odds_number;
    } else {
      return this.awayTeamName + " " + this.odds_number;
    }
  }

  constructor(data?: HandicapInterface) {
    if (data) {
      this.id = data.id;
      this.odds = data.odds;
      this.stake = data.stake;
      this.date = data.date;
      this.selectedPair = data.selectedPair;
      this.homeTeamName = data.homeTeamName;
      this.awayTeamName = data.awayTeamName;
      this.selectedTeam = data.selectedTeam;
    }
  }
}
