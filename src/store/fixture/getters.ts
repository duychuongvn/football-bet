import { GetterTree } from 'vuex';
import { RootState } from '@/store/types';

export const getters: GetterTree<any, RootState> = {
  fixturesToday: state => state.fixturesToday,
  fixturesTomorrow: state => state.fixturesTomorrow,
  fixturesFuture: state => state.fixturesFuture,
  isInit: state => state.isInit
};
