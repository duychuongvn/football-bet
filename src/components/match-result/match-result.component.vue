<template src="./match-result.component.html"></template>

<script lang="ts">
  import { Component, Vue, Prop, Watch } from 'vue-property-decorator';
  import { Getter, Action } from 'vuex-class';

  import { DIALOG_NAME, DIALOG_CLOSE } from '@/shared/enums/dialog'

  const isEqual = require('lodash/isEqual')

  @Component
  export default class MatchResultComponent extends Vue {
    @Prop() match: any
    @Action('loadBettings', { namespace: 'betting' }) loadBettings: any
    @Action('getBetting', { namespace: 'betting' }) getBetting: any
    @Action('clearBetting', { namespace: 'betting' }) clearBetting: any
    @Getter('totalBettings', { namespace: 'betting' }) totalBettings!: any
    @Getter('bettings', { namespace: 'betting' }) bettings!: any

    @Action('openDialog', { namespace: 'dialog' }) openDialog: any
    @Getter('initData', { namespace: 'dialog' }) initData: any
    @Getter('account', { namespace: 'web3' }) account: any
    @Getter('isAccount', { namespace: 'web3' }) isAccount: any

    @Action('notify', { namespace: 'notify' }) notify: any

    public headTb: Array<Object> = [
      { text: '#', align: 'left', sortable: false },
      { text: `${this.match.homeTeam}`, align: 'left', sortable: false, img: true, imgUrl: `${this.match.homeTeamFlag}` },
      { text: 'Odds', align: 'center', sortable: false },
      { text: `${this.match.awayTeam}` , align: 'left', sortable: false, img: true, imgUrl: `${this.match.awayTeamFlag}` },
      { text: 'Total Stake', align: 'center', sortable: false },
      { text: 'Available Stake', align: 'center', sortable: false },
      { text: '', sortable: false }
    ]

    public isLoadingBetting: any = null;

    created() {
      this.loadBettings({
        id: this.match.id,
        isLoad: false
      });
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

    selectedTeamAddr(betting: any, type: number) {
      return betting.bookmakerTeam === type ? betting.bookmakerAddress : '';
    }

    @Watch('initData')
    getInitDialog(value: any, oldValue: any) {
      if (value && value.key === DIALOG_CLOSE.BETTING_RELOAD) {
        this.isLoadingBetting = setInterval(() => {
          this.loadBettings({
            id: this.match.id,
            isLoad: true
          });
        }, 5000)
      }
    }

    @Watch('isAccount')
    getAccount(value: string, oldValue: string) {
      if (!isEqual(value, oldValue)) {
        this.loadBettings({
          id: this.match.id,
          isLoad: false
        });
      }
    }

    isActiveShare(bettingId: number): boolean {
      return (+this.$route.query['accept'] === bettingId);
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
