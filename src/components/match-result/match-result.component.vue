<template src="./match-result.component.html"></template>

<script lang="ts">
  import { Component, Vue, Prop, Watch } from 'vue-property-decorator';
  import { Getter, Action } from 'vuex-class';

  import { DIALOG_NAME, DIALOG_CLOSE } from '@/shared/enums/dialog';

  import { Betting } from '@/shared/model/betting';
  import { Punter } from '@/shared/model/punter';

  const isEqual = require('lodash/isEqual');

  @Component({
    components: {
      'match-punters': () => import('@/components/match-result-punters/match-result-punters.component.vue')
    }
  })
  export default class MatchResultComponent extends Vue {
    @Prop() match: any
    @Action('loadBettings', { namespace: 'betting' }) loadBettings: any
    @Action('clearBetting', { namespace: 'betting' }) clearBetting: any
    @Getter('bettings', { namespace: 'betting' }) bettings!: Betting[];

    @Action('openDialog', { namespace: 'dialog' }) openDialog: any
    @Getter('initData', { namespace: 'dialog' }) initData: any
    @Getter('account', { namespace: 'web3' }) account: any
    @Getter('isAccount', { namespace: 'web3' }) isAccount: any

    @Action('notify', { namespace: 'notify' }) notify: any

    public headTb: Array<Object> = [
      { text: '#', align: 'left', sortable: false },
      { text: `Bookmarker Address`, align: 'left', sortable: false },
      { text: 'Handicap', align: 'center', sortable: false },
      { text: `Total Stake` , align: 'left', sortable: false },
      { text: 'Settled', align: 'center', sortable: false },
      { text: 'Open', align: 'center', sortable: false },
      { text: 'Settler', align: 'center', sortable: false },
      { text: '', sortable: false }
    ]
    public isLoadingBetting: any = null;
    public search: any = '';

    private _countBeting: number = 0;

    created() {
      this.loadBettings(this.match);
    }

    oddsString (item: any) {
      let _teamName = item.bookmakerTeam === 0 ? this.match.homeTeam : this.match.awayTeam;
      let _odds: any = item.odds / 100;

      _odds = _odds > 0 ? `+${_odds}` : _odds;

      return `${_teamName} @${_odds}`;
    }

    createOdds(odds: any) {
      const _initOpts = {
        key: DIALOG_NAME.STORE_BETTING,
        isOpen: true,
        name: 'dialog-betting',
        initData: {
          match: this.match,
          odds: odds
        }
      };

      this.openDialog(_initOpts)
    }

    customFilter() {
      if (this.search) {
        return this.bettings.filter((betting: Betting) => betting.id === this.search);
      }
      return this.bettings;
    }

    @Watch('initData')
    getInitDialog(value: any, oldValue: any) {
      if (value && value.key === DIALOG_CLOSE.BETTING_RELOAD) {
        this._countBeting = this.bettings.length;

        this.isLoadingBetting = setInterval(() => {
          this.loadBettings(this.match);
        }, 2000);
      }

      if (value && value.key === DIALOG_CLOSE.BETTING_DEAL_RELOAD) {
        this.bettings.filter((betting: Betting) => {
          if (betting.id === value.data.bettingId) {
            betting.settledAmount += value.data.amount;
            betting.punters.push({
              no: betting.punters.length + 1,
              settledAmount: value.data.amount,
              wallet: value.data.account
            });

            if (betting.settledAmount === betting.bookmakerAmount) {
              betting.status = 2;
            }
          }
        })
      }
    }

    @Watch('bettings')
    getBetting(value: any, oldValue: any) {
      if (value.length !== 0) {
        value.map((item: any) => {
          item.account = this.account.address;
        });
      }

      if (value.length !== 0 && this.$route.query && this.$route.query.accept) {
        const _betTmp: Betting = this.bettings[+this.$route.query.accept];

        if (!!_betTmp) {
          this.search = _betTmp.bettingId;
          this.createOdds(_betTmp);
        }
      }

      if (this.isLoadingBetting && value.length > this._countBeting) {
        clearInterval(this.isLoadingBetting);
        this.isLoadingBetting = undefined;
        this._countBeting = 0;
      }
    }

    @Watch('isAccount')
    getAccount(value: string, oldValue: string) {
      if (!isEqual(value, oldValue)) {
        this.loadBettings(this.match);
      }
    }

    openShare(bettingId: number) {
      const _initOpts = {
        key: DIALOG_NAME.BETTING_SHARING,
        isOpen: true,
        name: 'dialog-sharing',
        initData: {
          bettingId: bettingId,
          homeTeam: this.match.homeTeam,
          awayTeam: this.match.awayTeam,
          date: this.match.date,
          key: DIALOG_NAME.SHARING_SOCIAL
        }
      };

      this.openDialog(_initOpts)
    }

    destroyed() {
      clearInterval(this.isLoadingBetting);
      this.clearBetting();
      this.isLoadingBetting = null
    }
  }
</script>
