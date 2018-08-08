<template src="./odds-result.component.html"></template>

<script lang="ts">
import { Component, Vue, Watch } from "vue-property-decorator";
import { Action, Getter } from 'vuex-class';

import { DIALOG_NAME } from '@/shared/enums/dialog';

@Component
export default class OddsResultComponent extends Vue {
  @Action('openDialog', { namespace: 'dialog' }) openDialog: any;

  @Action('oddsByMatchId', { namespace: 'odds' }) oddsByMatchId: any;

  @Getter('sortParent', { namespace: 'odds' }) sortParent: any;
  @Getter('sortChild', { namespace: 'odds' }) sortChild: any;
  @Getter('myOdds', { namespace: 'odds' }) myOdds: any;
  @Getter('totalOdds', { namespace: 'odds' }) totalOdds: any;

  public resultHead: Array<Object> = [
    {
      text: '#',
      sortable: false,
      value: 'id'
    },
    { text: 'odds', value: 'odds', sortable: false },
    { text: 'stake', value: 'stake', align: 'center', sortable: false },
    { text: 'return', value: 'return', align: 'center', sortable: false },
    { text: 'betting status', value: 'status', sortable: false },
    { text: '', sortable: false, width: '300px' }
  ]

  public selectedParent: string = 'DATE';
  public selectedChild: number = 1;

  get oddsResult() {
    return this.myOdds;
  }

  @Watch('totalOdds')
  getTotalOdds(value: any, oldValue: any) {
    this.oddsByMatchId();
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