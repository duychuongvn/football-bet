import { PunterInterface } from './punter';

export interface BettingInterface {
  id: any;
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
  isSelected?: boolean;
  punters: PunterInterface[];
}
