import { Betting } from '@/store/betting/types'

export interface Fixture {
  name: string;
  bettings: Betting[];
}

export interface FixtureState {
  fixturesToday: Fixture[],
  fixturesTomorrow: Fixture[],
  fixturesFuture: Fixture[],
}
