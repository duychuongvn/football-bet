export interface Team {
  id: number;
  name: string;
  flag: string;
}

export interface FixtureInterface {
  id: number;
  date: string;
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
  leagueName?: string | undefined;
}
