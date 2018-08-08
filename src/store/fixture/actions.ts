import { ActionTree } from 'vuex';
import { RootState } from '@/store/types';

import { RECEVER_FIXTURES, RECEVER_BETTING } from '@/store/mutations';

import { fixtureService } from '@/shared/services/fixtures.service';

const fixtureData = [
  {
    id: 1,
    name: "Premier League",
    date: "2018/08/10 12:00",
    bettings: [
      {
        id: 1,
        date: "2018/08/10 12:00",
        homeTeam: "Denmark",
        awayTeam: "Australia"
      },
      {
        id: 2,
        date: "2018/08/10 12:00",
        homeTeam: "France",
        awayTeam: "Peru"
      },
      {
        id: 3,
        date: "2018/08/10 12:00",
        homeTeam: "Argentina",
        awayTeam: "Brazil"
      },
      {
        id: 4,
        date: "2018/08/10 12:00",
        homeTeam: "Colombia",
        awayTeam: "Croatia"
      }
    ]
  },
  {
    id: 2,
    name: "UEFA Champions League",
    date: "2018/08/10 12:00",
    bettings: [
      {
        id: 1,
        date: "2018/08/10 12:00",
        homeTeam: "Denmark",
        awayTeam: "Australia"
      },
      {
        id: 2,
        date: "2018/08/10 12:00",
        homeTeam: "France",
        awayTeam: "Peru"
      },
      {
        id: 3,
        date: "2018/08/10 12:00",
        homeTeam: "Argentina",
        awayTeam: "Brazil"
      },
      {
        id: 4,
        date: "2018/08/10 12:00",
        homeTeam: "Colombia",
        awayTeam: "Croatia"
      }
    ]
  },
  {
    id: 3,
    name: "Bundesliga",
    date: "2018/08/10 12:00",
    bettings: [
      {
        id: 1,
        date: "2018/08/10 12:00",
        homeTeam: "Denmark",
        awayTeam: "Australia"
      },
      {
        id: 2,
        date: "2018/08/10 12:00",
        homeTeam: "France",
        awayTeam: "Peru"
      },
      {
        id: 3,
        date: "2018/08/10 12:00",
        homeTeam: "Argentina",
        awayTeam: "Brazil"
      },
      {
        id: 4,
        date: "2018/08/10 12:00",
        homeTeam: "Colombia",
        awayTeam: "Croatia"
      }
    ]
  },
  {
    id: 4,
    name: "La Liga",
    date: "2018/08/10 12:00",
    bettings: [
      {
        id: 1,
        date: "2018/08/10 12:00",
        homeTeam: "Denmark",
        awayTeam: "Australia"
      },
      {
        id: 2,
        date: "2018/08/10 12:00",
        homeTeam: "France",
        awayTeam: "Peru"
      },
      {
        id: 3,
        date: "2018/08/10 12:00",
        homeTeam: "Argentina",
        awayTeam: "Brazil"
      },
      {
        id: 4,
        date: "2018/08/10 12:00",
        homeTeam: "Colombia",
        awayTeam: "Croatia"
      }
    ]
  },
  {
    id: 5,
    name: "Seria A",
    date: "2018/08/10 12:00",
    bettings: [
      {
        id: 1,
        date: "2018/08/10 12:00",
        homeTeam: "Denmark",
        awayTeam: "Australia"
      },
      {
        id: 2,
        date: "2018/08/10 12:00",
        homeTeam: "France",
        awayTeam: "Peru"
      },
      {
        id: 3,
        date: "2018/08/10 12:00",
        homeTeam: "Argentina",
        awayTeam: "Brazil"
      },
      {
        id: 4,
        date: "2018/08/10 12:00",
        homeTeam: "Colombia",
        awayTeam: "Croatia"
      }
    ]
  }
]

export const actions: ActionTree<any, RootState> = {
  fetchFixtures({ commit }): any {
    // fixtureService.fixturesHashId()
    //   .then((res: any) => {
    //     console.log(res, 'sv');
    //   })

    // fixtureService.fixtures('QmbSq6am6LKCrLL938DBGci2XKiRcedE7izFQ4cSaaSsz5')
    //   .then((res: any) => {
    //     console.log(res, 'ipfs');
    //   })

    commit(RECEVER_FIXTURES, fixtureData);
  }
};