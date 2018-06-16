import { FixtureResult } from "models/fixtureResult";

export interface FixtureInterface {
  id: number|string,
  competitionId: number,
  homeTeamId: number,
  homeTeamName: string,
  awayTeamId: number,
  awayTeamName: string,
  date: string,
  status: string,
  awayFlag: string,
  homeFlag: string,
  result: FixtureResult

};
