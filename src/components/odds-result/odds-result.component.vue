<template src="./odds-result.component.html"></template>

<script lang="ts">
import { Component, Vue, Watch } from "vue-property-decorator";
import { Action, Getter } from 'vuex-class';

import { DIALOG_NAME } from '@/shared/enums/dialog';

import { Profile } from '@/shared/model/profile';

@Component({
  components: {
    'match-punters': () => import('@/components/match-result-punters/match-result-punters.component.vue')
  }
})
export default class OddsResultComponent extends Vue {
  @Action('openDialog', { namespace: 'dialog' }) openDialog: any;

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

  public selectedParent: string = 'DATE';
  public selectedChild: number = 1;

  get oddsResult() {
    const _odssRs: Profile[] = [];
    this.totalOdds.map((odds: any) => {
      const _odds: Profile = new Profile(odds);

      _odds.match.homeTeam = odds.match.homeTeam;
      _odds.match.awayTeam = odds.match.awayTeam;
      _odds.match.date = odds.match.time * 1000;

      _odssRs.push(_odds);
    });
    return _odssRs;
  }

  oddsString (item: any, match: any) {
    let _teamName = item.bookmakerTeam === 0 ? match.homeTeam : match.awayTeam;
    let _odds: any = item.odds / 100;

    _odds = _odds > 0 ? `+${_odds}` : _odds;

    return `${_teamName} @${_odds}`;
  }

  @Watch('totalOdds')
  getTotalOdds(value: any, oldValue: any) {
    // this.oddsByMatchId();
  }

  dialogCancel(odds: any, matchId: string) {
    const _initOpts = {
      key: DIALOG_NAME.ODDS_CANCEL,
      isOpen: true,
      name: 'dialog-odds-cancel',
      initData: {
        odds: odds,
        matchId: matchId
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
}
</script>
