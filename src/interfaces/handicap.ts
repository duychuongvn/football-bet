export interface HandicapInterface{
  id: number | string,
  selectedPair: string, //1 home first, 2 away first
  homeTeamName: string,
  awayTeamName: string,
  odds: string | number,
  stake: number,
  date: string,
  selectedTeam: string //0 selected home, 1 selected away

}
