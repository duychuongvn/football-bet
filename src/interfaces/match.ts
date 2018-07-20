import {Betting} from 'models/betting_bk'

export interface MatchInterface {
  matchId: any;
  homeTeam: string;
  awayTeam: string;
  homeGoals: number;
  awayGoals: number;
  time: number;
  status: number;
  bettings: Betting[];
  approved: boolean
}
