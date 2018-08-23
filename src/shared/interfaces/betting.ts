import { PunterInterface } from './punter';

export interface BettingInterface {
  id: number;
  bettingId: number;
  bookmakerAddress: string;
  bookmakerAmount: number;
  bookmakerTeam: number;
  matchId: any;
  odds: number;
  settledAmount: number;
  status: number;
  punters: PunterInterface[];
}
