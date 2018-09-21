<template src="./odds-result.component.html"></template>

<script lang="ts">
import { Component, Vue, Watch } from "vue-property-decorator";
import { Action, Getter } from 'vuex-class';

import { DIALOG_NAME, DIALOG_CLOSE } from '@/shared/enums/dialog';
import { USER_TYPE_OPEN, USER_TYPE_FINISHED } from '@/shared/enums/odds';

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

  public headTbOpen: Array<Object> = [
    { text: '#', align: 'left', sortable: false },
    { text: `Address`, align: 'left', sortable: false },
    { text: 'Handicap', align: 'center', sortable: false },
    { text: `Stake` , align: 'center', sortable: false },
    { text: 'Open', align: 'center', sortable: false },
    { text: 'Status', align: 'center', sortable: false },
    { text: '', sortable: false }
  ];

  public headTbFinish: Array<Object> = [
    { text: '#', align: 'left', sortable: false },
    { text: `Address`, align: 'left', sortable: false },
    { text: 'Handicap', align: 'center', sortable: false },
    { text: `Stake` , align: 'center', sortable: false },
    { text: 'Return', align: 'center', sortable: false },
    { text: 'Payment Status', align: 'center', sortable: false },
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

  public selectedFilter: any = Object.keys(USER_TYPE_OPEN)[0];

  public selectedParent: string = 'DATE';
  public selectedChild: number = 1;

  get isOddsOpen(): boolean {
    return this.oddsTypeSelected === "OPEN";
  }

  get listFilter(): Array<Object> {
    const resultFilter: Array<Object> = [];
    let _filterType: any = USER_TYPE_OPEN;

    if (!this.isOddsOpen) {
      _filterType = USER_TYPE_FINISHED;
    }

    for(let i in _filterType) {
      resultFilter.push({
        key: i,
        name: this.capitalizeFirstLetter(_filterType[i]),
        number: 0
      })
    }

    return resultFilter;
  }

  get headTb() {
    return this.isFinished ? this.headTbFinish : this.headTbOpen;
  }

  get oddsResult() {
    const _oddsRs: Profile[] = [];
    this.totalOdds.map((odds: any) => {
      const _odds: Profile = new Profile(odds);

      _odds.match.homeTeam = odds.match.homeTeam;
      _odds.match.awayTeam = odds.match.awayTeam;
      _odds.match.date = moment(odds.match.time * 1000).format('YYYY-MM-DD HH:mm:ss');

      _odds.bettings = _odds.bettings.filter((betting: any) => {
        if (this.isFinished) {
          switch (USER_TYPE_FINISHED[this.selectedFilter]) {
            case USER_TYPE_FINISHED.ODDS_LOST:
            case USER_TYPE_FINISHED.ODDS_WON:
            case USER_TYPE_FINISHED.ODDS_REFUNDED:
              return betting.status === 4;
            default:
              return betting.status > 3;
          }
        } else {
          switch (USER_TYPE_OPEN[this.selectedFilter]) {
            case USER_TYPE_OPEN.ODDS_OPEN:
              return betting.status === 0;
            case USER_TYPE_OPEN.ODDS_SETTLED:
              return betting.status === 1;
            case USER_TYPE_OPEN.ODDS_CANCELLED:
              return betting.status === 3;
            default:
              return betting.status <= 3;
          }
        }
      });

      if (!!_odds.bettings.length) {
        _oddsRs.push(_odds);
      }
    });

    return _oddsRs;
  }

  get isFinished() {
    return this.oddsTypeSelected === 'FINISHED';
  }

  capitalizeFirstLetter(string: string): string {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  isActiveFilter(key: any): boolean {
    return this.selectedFilter === key;
  }

  changedFilter(key: any): void {
    if (key === this.selectedFilter) return;
    this.selectedFilter = key;
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

    this.selectedFilter = Object.keys(USER_TYPE_OPEN)[0];
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
