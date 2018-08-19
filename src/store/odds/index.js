import { getters } from '@/store/odds/getters';
import { actions } from '@/store/odds/actions';
import { mutations } from '@/store/odds/mutations';
export const state = {
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
const namespaced = true;
export const odds = {
    namespaced,
    state,
    getters,
    actions,
    mutations
};
//# sourceMappingURL=index.js.map