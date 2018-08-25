import { PunterInterface } from './punter';

export interface BettingInterface {
  id: number;
  bettingId: any;
  bookmakerAddress: string;
  bookmakerAmount: number;
  bookmakerTeam: number;
  matchId: any;
  odds: number;
  settledAmount: number;
  status: number;
  punters: PunterInterface[];
}
