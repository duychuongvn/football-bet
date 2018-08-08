import { Betting } from '@/store/betting/types'

export interface Fixture {
  id: number;
  name: string;
  date: string;
  bettings: Betting[];
}

export interface FixtureState {
  fixtures: Fixture[]
}