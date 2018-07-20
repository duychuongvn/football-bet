export interface BettingInterface {
  bettingId: any,
  matchId: any,
  amount: number,
  offer: string,
  dealer: string,
  odds: any,
  stake: number,
  status: number,
  selectedTeam: number,
  homeOffer: string,
  awayOffer: string,
  homeDealer: string,
  awayDealer: string
};

export interface NewBettingInterface {
  id: number,
  date: string,
  homeTeam: string,
  awayTeam: string
};
