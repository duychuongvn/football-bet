import { RECEVER_FIXTURES } from '@/store/mutations';
const orderBy = require('lodash/orderBy');
export const mutations = {
    [RECEVER_FIXTURES](state, fixturesObj) {
        let _fixtures;
        const _fixturesData = {
            name: fixturesObj.name,
            bettings: []
        };
        switch (fixturesObj.key) {
            case 'TODAY':
                _fixtures = state.fixturesToday;
                break;
            case 'TOMORROW':
                _fixtures = state.fixturesTomorrow;
                break;
            case 'FUTURE':
                _fixtures = state.fixturesFuture;
                break;
        }
        const _index = _fixtures.findIndex((item) => item.name === fixturesObj.name);
        if (_index !== -1) {
            _fixtures[_index].bettings = orderBy(fixturesObj.bettings, ['date'], ['asc']);
        }
        else {
            _fixtures.push(_fixturesData);
        }
    }
};
//# sourceMappingURL=mutations.js.map