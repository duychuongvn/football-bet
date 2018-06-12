export interface BettingInterface{
  bettingId: string| number,
  matchId: string | number,
  bookmarkerAddress: string,
  punterAddress: string,
  odds: string | number,
  stake: number,
  status: number
}
