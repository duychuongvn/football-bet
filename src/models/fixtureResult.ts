import { FixtureResultInterface, FixtureGoalHaftimeInterface } from "interfaces/fixtureResult";

class GoalHaflTime {
  private _goalsHomeTeam: number;
  public get goalsHomeTeam(): number {
    return this._goalsHomeTeam;
  }
  public set goalsHomeTeam(v: number) {
    this._goalsHomeTeam = v;
  }

  private _goalsAwayTeam: number;
  public get goalsAwayTeam(): number {
    return this._goalsAwayTeam;
  }
  public set goalsAwayTeam(v: number) {
    this._goalsAwayTeam = v;
  }

  constructor(data?: FixtureGoalHaftimeInterface){
    this.goalsAwayTeam = data.goalsAwayTeam;
    this.goalsHomeTeam = data.goalsHomeTeam;
  }
}

export class FixtureResult {
  private _haflTime: GoalHaflTime;
  public get haflTime(): GoalHaflTime {
    return this._haflTime;
  }
  public set haflTime(v: GoalHaflTime) {
    this._haflTime = v;
  }

  private _goalsAwayTeamHalfTime: number;
  public get goalsAwayTeamHalfTime(): number {
    return this._goalsAwayTeamHalfTime;
  }
  public set goalsAwayTeamHalfTime(v: number) {
    this._goalsAwayTeamHalfTime = v;
  }

  private _goalsHomeTeam: number;
  public get goalsHomeTeam(): number {
    return this._goalsHomeTeam;
  }
  public set goalsHomeTeam(v: number) {
    this._goalsHomeTeam = v;
  }

  private _goalsAwayTeam: number;
  public get goalsAwayTeam(): number {
    return this._goalsAwayTeam;
  }
  public set goalsAwayTeam(v: number) {
    this._goalsAwayTeam = v;
  }

  private _goalsHomeTeamHalfTime: number;
  public get goalsHomeTeamHalfTime(): number {
    return this._goalsHomeTeamHalfTime;
  }
  public set goalsHomeTeamHalfTime(v: number) {
    this._goalsHomeTeamHalfTime = v;
  }

  constructor(data?: FixtureResultInterface) {
    this.goalsAwayTeam = data.goalsAwayTeam;
    this.goalsHomeTeam = data.goalsHomeTeam;
  }
}
