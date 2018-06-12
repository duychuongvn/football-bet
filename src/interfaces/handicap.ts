export interface HandicapInterface{
  id: number | string,
  pairs: any[],
  selectedPair: string,
  homeTeamName: string,
  awayTeamName: string,
  odds: string,
  stake: number,
  date: string;
}
