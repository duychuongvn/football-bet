export interface Team {
  id: number;
  name: string;
}

export interface FixtureInterface {
  id: number;
  utcDate: string;
  status: string;
  homeTeam: Team;
  awayTeam: Team;
  current_bet?: number;
  settle?: number;
  open?: number;
  approved: boolean;
  awayGoals: number;
  homeGoals: number;
  matchId?: string | number;
}
