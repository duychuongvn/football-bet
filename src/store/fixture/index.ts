import { Module } from 'vuex';
import { RootState } from '@/store/types';

import { getters } from '@/store/fixture/getters';
import { actions } from '@/store/fixture/actions';
import { mutations } from '@/store/fixture/mutations';

import { FixtureState } from '@/store/fixture/types';

export const state: FixtureState = {
  fixturesToday: [],
  fixturesTomorrow: [],
  fixturesFuture: [],
  isInit: false,
  competitions: []
};

const namespaced: boolean = true;

export const fixture: Module<any, RootState> = {
  namespaced,
  state,
  getters,
  actions,
  mutations
};
