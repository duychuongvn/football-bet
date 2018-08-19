import { MatchInterface } from '@/shared/interfaces/match'

export interface HandicapInterface {
  match: MatchInterface;
  homeTeam?: string;
  awayTeam?: string;
  time?: number;
  odds?: number;
  stake?: number;
  selectedTeam?: number;
  account: string;
  amount: number;
}
