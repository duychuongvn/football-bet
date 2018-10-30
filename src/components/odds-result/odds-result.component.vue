<template src="./odds-result.component.html"></template>

<script lang="ts">
import { Component, Vue, Watch } from "vue-property-decorator";
import { Action, Getter } from 'vuex-class';

import { DIALOG_NAME, DIALOG_CLOSE } from '@/shared/enums/dialog';
import { USER_TYPE_OPEN, USER_TYPE_FINISHED } from '@/shared/enums/odds';

import { Profile } from '@/shared/model/profile';
import { Betting } from '@/shared/model/betting';

import { BetherContractService } from "@/shared/services/bether.service";

import { DateTime } from 'luxon';
import { Team } from '@/shared/model/team';

const _isEqual = require('lodash/isEqual');
const orderBy = require('lodash/orderBy');
const _uniq = require('lodash/uniq');
const _groupByLodash = require('lodash/groupBy');

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

  @Getter('account', { namespace: 'web3' }) account: any;

  @Action('notify', { namespace: 'notify' }) notify: any;

  @Getter('competitions', { namespace: 'fixture' }) competitions: any;

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
    { text: `Settled` , align: 'center', sortable: false },
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

  get resultData() {
    let _tmpData = [];
    const _oddsGroup = _groupByLodash(this.totalOdds, 'matchId');

    for (let i in _oddsGroup) {
      let _tmpBettings = _oddsGroup[i][0].bettings;
      let _tmpStake: any = +_oddsGroup[i][0].summary.stake;

      _oddsGroup[i].filter((item: any, key: number) => {
        if (key !== 0) {
          _tmpBettings = _tmpBettings.concat(item.bettings);
          _tmpStake = _tmpStake + (+item.summary.stake);
        }
      });

      _tmpData.push( {
        bettings: _uniq(_tmpBettings),
        match: _oddsGroup[i][0].match,
        matchId: _oddsGroup[i][0].matchId,
        summary: {
          payoutAvailable: _oddsGroup[i][0].summary.payoutAvailable,
          stake: parseFloat(_tmpStake).toFixed(3)
        },
      });
    }

    _tmpData.filter((item: any, key: any) => {
      const _idxHomeTeam = this.competitions.findIndex((compe: any) => _isEqual(compe.name, item.match.homeTeam));
      const _idxAwayTeam = this.competitions.findIndex((compe: any) => _isEqual(compe.name, item.match.awayTeam));

      item.match.homeTeam = this.competitions[_idxHomeTeam];
      item.match.awayTeam = this.competitions[_idxAwayTeam];

      item.match.id = key;
    });

    return _tmpData;
  }

  get oddsResult() {
    const _oddsRs: Profile[] = [];

    this.resultData.map((odds: any) => {
      const _odds: Profile = new Profile(odds);

      _odds.match.homeTeam = new Team(odds.match.homeTeam);
      _odds.match.awayTeam = new Team(odds.match.awayTeam);
      _odds.match.date = DateTime.fromMillis(odds.match.time * 1000).toISO();

      if (this.isFinished) {
        if (+_odds.match.status < 4) {
          _odds.bettings = [];
        }
      } else {
        if (+_odds.match.status >= 4) {
          _odds.bettings = [];
        }
      }

      if (!!_odds.bettings) {
        _odds.bettings = _odds.bettings.filter((betting: any) => {

          odds.summary.payoutAvailable = (odds.match.status === 4 && betting.status <= 2 && betting.bookmakerResult < 5);

          if (this.isFinished) {
            switch (USER_TYPE_FINISHED[this.selectedFilter]) {
              case USER_TYPE_FINISHED.ODDS_LOST:
                return betting.bookmakerResult >= 4;
              case USER_TYPE_FINISHED.ODDS_WON:
                return betting.bookmakerResult === 1 || betting.bookmakerResult === 2;
              case USER_TYPE_FINISHED.ODDS_REFUNDED:
                return betting.status === 4;
              default:
                return betting.bookmakerResult !== 0;
            }
          } else {
            switch (USER_TYPE_OPEN[this.selectedFilter]) {
              case USER_TYPE_OPEN.ODDS_OPEN:
                return betting.status === 0;
              case USER_TYPE_OPEN.ODDS_SETTLED:
                return betting.status === 1 || betting.status === 2;
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
      }
    });

    return orderBy(_oddsRs, ['match.date'], ['desc']);
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
    let _teamName = item.bookmakerTeam === 0 ? match.homeTeam.name : match.awayTeam.name;
    let _odds: any = item.odds / 100;

    _odds = _odds > 0 ? `+${_odds}` : _odds;

    return `${_teamName} @${_odds}`;
  }

  oddsStatus(betting: any) {
    if (this.isFinished) {
      return betting.bookmakerResultString;
    } else {
      return betting.statusString;
    }
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

  dialogClaimStake(odds: Profile) {
    BetherContractService.claimStake({
      matchId: odds.matchId,
      bettings: odds.bettings,
      account: this.account.address
    }).subscribe((response: any) => {
      this.notify({
        mode: 'success',
        message: 'Your has request payout success !'
      });
      }, (error: any) => {
      this.notify({
        mode: 'error',
        message: error.message
      });
    })
  }

  dialogCancel(betting: any, match: any, matchId: any) {
    const _initOpts = {
      key: DIALOG_NAME.ODDS_CANCEL,
      isOpen: true,
      name: 'dialog-odds-cancel',
      initData: {
        oddsString: this.oddsString(betting, match),
        stake: betting.openAmount,
        bettingId: betting.bettingId,
        match: match,
        matchId: matchId
      }
    };

    this.openDialog(_initOpts);
  }

  openShare(betting: any, match: any) {
    const _initOpts = {
      key: DIALOG_NAME.BETTING_SHARING,
      isOpen: true,
      name: 'dialog-sharing',
      initData: {
        bettingId: betting.bettingId.valueOf(),
        matchKey: match.key,
        homeTeam: match.homeTeam,
        awayTeam: match.awayTeam,
        date: match.date
      }
    };

    this.openDialog(_initOpts)
  }

  openAmount(betting: Betting) {
    if (this.isFinished) {
      return `${betting.returnedAmount} ETH`
    } else {
      return betting.openAmount;
    }
  }

  returnClass(betting: Betting) {
    if (this.isFinished) {
      switch (betting.bookmakerResult) {
        case 1:
        case 2:
          return 'light-green--text';
        case 3:
          return 'white--text';
        case 4:
        case 5:
          return 'red--text';
      }
    }
    return 'white--text';
  }

  @Watch('initData')
  getCancelDialog(newVal: boolean | any) {
    if (newVal && newVal.key === DIALOG_CLOSE.ODDS_RELOAD) {
      let _idxOdds = this.resultData.findIndex((odds: any) => odds.matchId === newVal.oddsCancel.matchId);
      if (_idxOdds !== -1) {
        let _idxBetting = this.resultData[_idxOdds].bettings.findIndex((betting: any) => +betting.bettingId === +newVal.oddsCancel.bettingId.valueOf());
        if (_idxBetting !== -1) {
          this.resultData[_idxOdds].bettings[_idxBetting].status = 3;
        }
      }
    }
  }
}
</script>
