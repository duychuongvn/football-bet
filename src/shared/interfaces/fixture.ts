export interface TeamInterface {
  id: number;
  name: string;
  flag: string;
}

export interface ScoreItem {
  awayTeam: number | string;
  homeTeam: number | string;
}

export interface ScoreFixture {
  duration: string;
  extraTime: ScoreItem;
  fullTime: ScoreItem;
  halfTime: ScoreItem;
  penalties: ScoreItem;
  winner: string;
}

export interface SumaryInterface {
  canceled: number;
  open: number;
  portionSettled: number;
  refuned: number;
  settledOrDone: number;
}

export interface DiffCurrentDate {
  years?: number;
  month?: number;
  days?: number;
  hours?: number;
  milliseconds?: number;
  minutes?: number;
  seconds?: number;
}

export interface FixtureInterface {
  id: number;
  date: string;
  status: string;
  homeTeam: TeamInterface;
  awayTeam: TeamInterface;
  score: ScoreFixture;
  current_bet?: number;
  settle?: number;
  open?: number;
  approved: boolean;
  awayGoals: number;
  homeGoals: number;
  matchId?: string | number;
  leagueName?: string | undefined;
}
