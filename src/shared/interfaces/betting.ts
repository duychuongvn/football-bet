import { PunterInterface } from './punter';

export interface BettingInterface {
  id: number;
  bettingId: any;
  bookmakerAddress: string;
  bookmakerAmount: number | string;
  bookmakerTeam: number;
  matchId: any;
  odds: number;
  settledAmount: number | string;
  status: number;
  bookmakerResult: number;
  returnedAmount: number | string;
  punters: PunterInterface[];
}
