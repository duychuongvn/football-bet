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
    @Prop() match: any;
    @Action('loadBettings', { namespace: 'betting' }) loadBettings: any;
    @Action('clearBetting', { namespace: 'betting' }) clearBetting: any;
    @Action('getBettingById', { namespace: 'betting' }) getBettingById: any;
    @Getter('bettings', { namespace: 'betting' }) bettings!: Betting[];

    @Getter('bether', { namespace: 'solobet' }) bether: any;
    @Getter('loadingBetting', { namespace: 'betting' }) loadingBetting!: boolean
    @Action('setLoadingBetting', { namespace: 'betting' }) setLoadingBetting: any

    @Action('openDialog', { namespace: 'dialog' }) openDialog: any;
    @Getter('initData', { namespace: 'dialog' }) initData: any;
    @Getter('account', { namespace: 'web3' }) account: any;
    @Getter('isAccount', { namespace: 'web3' }) isAccount: any;

    @Action('notify', { namespace: 'notify' }) notify: any;

    @Getter('newOffer', { namespace: 'solobet' }) newOffer: any

    public headTb: Array<Object> = [
      { text: '#', align: 'left', sortable: false },
      { text: `Bookmarker Address`, align: 'left', sortable: false },
      { text: 'Handicap', align: 'center', sortable: false },
      { text: `Total Stake` , align: 'left', sortable: false },
      { text: 'Settled', align: 'center', sortable: false },
      { text: 'Open', align: 'center', sortable: false },
      { text: 'Settler', align: 'center', sortable: false },
      { text: '', sortable: false }
    ];

    public search: any = '';

    public rowPerPage: Array<number> = [20,50,100];

    created() {
      this.loadBettings(this.match);
      this.bether.LogNewBet().watch((error: any, result: any) => {
        if (!error && isEqual(this.match.matchId, result.args.matchId)) {
          this.watchBettings(result.args.bettingIdx.valueOf())
        }
        this.setLoadingBetting(false);
      });

      this.bether.LogAcceptBet().watch((error: any, result: any) => {
        if (!error && isEqual(this.match.matchId, result.args.matchId)) {
          this.watchBettings(result.args.bettingIdx.valueOf())
        }
        this.setLoadingBetting(false);
      })
    }

    watchBettings(bettingId: number) {
      this.getBettingById({
        bettingId: bettingId,
        account: this.account.address
      });
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

    activeBetting(betting: Betting) {
      this.bettings.filter((item: Betting) => item.isSelected = false)
      betting.isSelected = true
    }

    @Watch('initData')
    getInitDialog(value: any) {
      if (value && (value.key === DIALOG_CLOSE.BETTING_DEAL_RELOAD || value.key === DIALOG_CLOSE.BETTING_RELOAD)) {
        this.setLoadingBetting(true);
      }
    }

    @Watch('bettings')
    getBetting(value: any) {
      if (value.length !== 0) {
        value.map((item: any) => {
          item.account = this.account.address;
        });
      }

      if (value.length !== 0 && this.$route.query && this.$route.query.accept) {
        const _bettingId: number = +this.$route.query.accept.split('-')[0];
        const _betTmp: Betting | undefined = this.bettings.find((betting: any) => betting.bettingId === _bettingId);

        if (!!_betTmp) {
          _betTmp.isSelected = true;
          this.createOdds(_betTmp);
        }
      }
    }

    @Watch('isAccount')
    getAccount(value: string, oldValue: string) {
      if (!isEqual(value, oldValue)) {
        this.loadBettings(this.match);
      }
    }

    @Watch('$route.query')
    getRouterQuery(newVal: any, oldVal: any) {
      if (Object.keys(newVal).length === 0 && Object.keys(oldVal).length !== 0) {
        this.search = '';
      }
    }

    openShare(bettingId: number) {
      const _initOpts = {
        key: DIALOG_NAME.BETTING_SHARING,
        isOpen: true,
        name: 'dialog-sharing',
        initData: {
          bettingId: bettingId,
          key: DIALOG_NAME.SHARING_SOCIAL
        }
      };

      this.openDialog(_initOpts)
    }

    destroyed() {
      this.clearBetting();
    }
  }
</script>
