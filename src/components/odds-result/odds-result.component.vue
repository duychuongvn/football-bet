<template src="./odds-result.component.html"></template>

<script lang="ts">
import { Component, Vue, Watch } from "vue-property-decorator";
import { Action, Getter } from 'vuex-class';

import { DIALOG_NAME, DIALOG_CLOSE } from '@/shared/enums/dialog';

import { Profile } from '@/shared/model/profile';

import * as moment from 'moment';

@Component({
  components: {
    'match-punters': () => import('@/components/match-result-punters/match-result-punters.component.vue')
  }
})
export default class OddsResultComponent extends Vue {
  @Action('openDialog', { namespace: 'dialog' }) openDialog: any;
  @Getter('initData', { namespace: 'dialog' }) initData: any;

  @Action('oddsByMatchId', { namespace: 'odds' }) oddsByMatchId: any;

  @Getter('sortParent', { namespace: 'odds' }) sortParent: any;
  @Getter('sortChild', { namespace: 'odds' }) sortChild: any;
  @Getter('myOdds', { namespace: 'odds' }) myOdds: any;
  @Getter('totalOdds', { namespace: 'odds' }) totalOdds: any;

  public headTb: Array<Object> = [
    { text: '#', align: 'left', sortable: false },
    { text: `Address`, align: 'left', sortable: false },
    { text: 'Handicap', align: 'center', sortable: false },
    { text: `Stake` , align: 'center', sortable: false },
    { text: 'Open', align: 'center', sortable: false },
    { text: 'Status', align: 'center', sortable: false },
    { text: '', sortable: false }
  ];

  public oddsTitle: Array<Object> = [
    {
      name: 'Open Matches',
      key: 'OPEN',
      active: true
    },
    {
      name: 'Finished Matches',
      key: 'FINISHED',
      active: false
    }
  ];

  public oddsTypeSelected: string = 'OPEN';

  public selectedParent: string = 'DATE';
  public selectedChild: number = 1;

  get oddsResult() {
    const _oddsRs: Profile[] = [];
    this.totalOdds.map((odds: any) => {
      const _odds: Profile = new Profile(odds);

      _odds.match.homeTeam = odds.match.homeTeam;
      _odds.match.awayTeam = odds.match.awayTeam;
      _odds.match.date = moment(odds.match.time * 1000).format('YYYY-MM-DD HH:mm:ss');

      _odds.bettings = _odds.bettings.filter((betting: any) => {
        return this.isFinished ? betting.status > 3 : betting.status <= 3;
      });

      _oddsRs.push(_odds);
    });

    return _oddsRs;
  }

  get isFinished() {
    return this.oddsTypeSelected === 'FINISHED';
  }

  oddsString (item: any, match: any) {
    let _teamName = item.bookmakerTeam === 0 ? match.homeTeam : match.awayTeam;
    let _odds: any = item.odds / 100;

    _odds = _odds > 0 ? `+${_odds}` : _odds;

    return `${_teamName} @${_odds}`;
  }

  selectOddsType(key: string) {
    if (key === this.oddsTypeSelected) return;

    this.oddsTitle.filter((item: any) => {
      item.active = false;

      if (item.key === key) {
        item.active = true
      }
    });

    this.oddsTypeSelected = key;
  }

  dialogClaimStake(bettings: any[], matchId: any) {
    const _initOpts = {
      key: DIALOG_NAME.CLAIM_STAKE,
      isOpen: true,
      name: 'dialog-odds-claim',
      initData: {
        odds: bettings,
        matchId: matchId
      }
    };
    this.openDialog(_initOpts);
  }

  dialogCancel(betting: any, match: any) {
    const _initOpts = {
      key: DIALOG_NAME.ODDS_CANCEL,
      isOpen: true,
      name: 'dialog-odds-cancel',
      initData: {
        oddsString: this.oddsString(betting, match),
        stake: betting.openAmount,
        bettingId: betting.bettingId,
        match: match
      }
    };

    this.openDialog(_initOpts);
  }

  openShare(bettingId: number, homeTeam: string, awayTeam: string, date: string) {
    const _initOpts = {
      key: DIALOG_NAME.BETTING_SHARING,
      isOpen: true,
      name: 'dialog-sharing',
      initData: {
        bettingId: bettingId,
        homeTeam: homeTeam,
        awayTeam: awayTeam,
        date: date
      }
    };

    this.openDialog(_initOpts)
  }

  @Watch('initData')
  getCancelDialog(newVal: boolean | any) {
    if (newVal && newVal.key === DIALOG_CLOSE.ODDS_RELOAD) {
      this.totalOdds.filter((odds: any) => {
        if (odds.matchId === newVal.oddsCancel.matchId) {
          odds.bettings.filter((betting: any) => {
            if (betting.bettingId === newVal.oddsCancel.bettingId) {
              betting.status = 3;
            }
          });
        }
      })
    }
  }
}
</script>
