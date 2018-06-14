import {Betting} from 'models/betting'

export interface MatchInterface {
  matchId: string | number;
  homeTeam: string;
  awayTeam: string;
  homeGoals: number;
  awayGoals: number;
  time: number;
  status: number;
  bettings: Betting[];
}
