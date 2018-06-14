export interface BettingInterface{
  bettingId: string| number,
  matchId: string | number,
  amount: number,
  offer: string,
  dealer: string,
  odds: string | number,
  stake: number,
  status: number,
  pair: number,
  homeOffer: string,
  awayOffer: string,
  homeDealer: string,
  awayDealer: string
}
