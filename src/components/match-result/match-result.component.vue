<template src="./match-result.component.html"></template>

<script lang="ts">
  import { Component, Vue, Prop, Watch } from 'vue-property-decorator';
  import { Getter, Action } from 'vuex-class';

  import { DIALOG_NAME, DIALOG_CLOSE } from '@/shared/enums/dialog'

  const isEqual = require('lodash/isEqual')

  @Component({
    components: {
      'match-punters': () => import('@/components/match-result-punters/match-result-punters.component.vue')
    }
  })
  export default class MatchResultComponent extends Vue {
    @Prop() match: any
    @Action('loadBettings', { namespace: 'betting' }) loadBettings: any
    @Action('clearBetting', { namespace: 'betting' }) clearBetting: any
    @Getter('bettings', { namespace: 'betting' }) bettings!: any

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

    @Watch('initData')
    getInitDialog(value: any, oldValue: any) {
      if (value && value.key === DIALOG_CLOSE.BETTING_RELOAD) {
        this.isLoadingBetting = setInterval(() => {
          this.loadBettings(this.match);
        }, 5000)
      }
    }

    @Watch('bettings')
    getBetting(value: any, oldValue: any) {
      if (this.isLoadingBetting && value.length !== oldValue.length) {
        clearInterval(this.isLoadingBetting);
        this.isLoadingBetting = undefined;
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
          date: this.match.date
        }
      };

      this.openDialog(_initOpts)
    }

    destroyed() {
      clearInterval(this.isLoadingBetting)
      this.clearBetting()
      this.isLoadingBetting = null
    }
  }
</script>
