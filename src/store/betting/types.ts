export interface Betting {
  id: number | string;
  date: string;
  dateString?: string;
  timeString?: string;
  dateTimeString?: string;
  homeTeam: string;
  homeTeamFlag?: string;
  awayTeam: string;
  awayTeamFlag?: string;
  bettingName?: string;
}

export interface BettingState {
  betting?: Betting,
  bettings?: Betting[],
  countBetting?: number,
  loadingBetting: boolean
}
