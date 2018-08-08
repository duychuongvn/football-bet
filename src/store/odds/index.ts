import { Module } from 'vuex';
import { RootState } from '@/store/types';
import { OddsState } from '@/store/odds/types';

import { getters } from '@/store/odds/getters';
import { actions } from '@/store/odds/actions';
import { mutations } from '@/store/odds/mutations';

export const state: OddsState = {
  sortParent: [
    {
      id: 1,
      key: 'DATE',
      name: 'Date'
    },
    {
      id: 2,
      key: 'STAKE',
      name: 'Stake'
    }
  ],
  sortChild: {
    DATE: [
      {
        id: 1,
        name: 'Most recent'
      },
      {
        id: 2,
        name: 'Latest to newest'
      }
    ],
    STAKE: [
      {
        id: 1,
        name: 'high to low'
      },
      {
        id: 2,
        name: 'low to high'
      }
    ]
  },
  resultFilter: [],
  totalOdds: [],
  myOdds: [],
  oddsFilter: [],
  originOdds: [],
  oddsCancel: undefined
};

const namespaced: boolean = true;

export const odds: Module<any, RootState> = {
  namespaced,
  state,
  getters,
  actions,
  mutations
};