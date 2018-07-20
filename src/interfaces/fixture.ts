import { FixtureResult } from "models/fixtureResult";
import { NewBettingInterface } from './betting';

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


export interface NewFixtureInterface {
  id: number,
  name: string,
  date: string,
  bettings: NewBettingInterface[]
};
