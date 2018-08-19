import { MatchInterface } from '@/shared/interfaces/match'

export interface HandicapInterface {
  match: MatchInterface;
  bettingId: number;
  account: string;
  amount: number;
}
