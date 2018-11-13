import { GetterTree } from 'vuex';
import { RootState } from '@/store/types';

const bundesliga = require('@/../football-data.org/competitions/bundesliga.json');
const uefa_champions_league = require('@/../football-data.org/competitions/uefa_champions_league.json');
const ligue_1 = require('@/../football-data.org/competitions/ligue_1.json');
const serie_a = require('@/../football-data.org/competitions/serie_a.json');
const premier_league = require('@/../football-data.org/competitions/premier_league.json');
const primera_division = require('@/../football-data.org/competitions/primera_division.json');
const primeria_liga = require('@/../football-data.org/competitions/primeria_liga.json');
const eredivisie = require('@/../football-data.org/competitions/eredivisie.json');

export const getters: GetterTree<any, RootState> = {
  fixturesToday: state => state.fixturesToday,
  fixturesTomorrow: state => state.fixturesTomorrow,
  fixturesFuture: state => state.fixturesFuture,
  isInit: state => state.isInit,
  competitions: () => [].concat(bundesliga, uefa_champions_league, ligue_1, serie_a, premier_league, primera_division, primeria_liga, eredivisie)
};
