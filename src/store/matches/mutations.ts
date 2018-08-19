import { MutationTree } from 'vuex';
import { RECEVER_MATCHES } from '@/store/mutations';

import { Web3Vue } from '@/shared/services/web3.service';

import * as moment from 'moment';

export const mutations: MutationTree<any> = {
  [RECEVER_MATCHES](state, match: any) {
    match.dateString     = moment(match.date, 'YYYY/MM/DD').format('LL [(]dddd[)]');
    match.timeString     = moment(match.date, 'YYYY/MM/DD HH:mm').format('HH:mm a');
    match.dateTimeString = moment(match.date, 'YYYY/MM/DD  HH:mm').format('LL [(]dddd[)] - HH:mm a');
    // match.homeTeamFlag   = require(`@/assets/flag/Flag_of_${match.homeTeam}.svg`);
    // match.awayTeamFlag   = require(`@/assets/flag/Flag_of_${match.awayTeam}.svg`);
    match.bettingName    = `${match.homeTeam} ~ ${match.awayTeam}`;

    state.match = match;
  }
};
