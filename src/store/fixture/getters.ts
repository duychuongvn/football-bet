import { GetterTree } from 'vuex';
import { FixtureState } from './types';
import { RootState } from '@/store/types';

export const getters: GetterTree<any, RootState> = {
  allFixtures(state): FixtureState[] {
    return state.fixtures
  }
};