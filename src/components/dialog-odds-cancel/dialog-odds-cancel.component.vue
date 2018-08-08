<template src="./dialog-odds-cancel.component.html"></template>

<script lang="ts">
  import { Component, Vue } from 'vue-property-decorator'
  import { Getter, Action } from 'vuex-class'

  import { DIALOG_NAME } from '@/shared/enums/dialog'

  @Component
  export default class DialogOddsCancelComponent extends Vue {
    @Getter('isOddsCancel', { namespace: 'dialog' }) isOddsCancel!: boolean;
    @Getter('initData', { namespace: 'dialog' }) dialogData!: any;

    @Action('cancelOdds', { namespace: 'odds' }) cancelOdds: any;

    @Getter('account', { namespace: 'web3' }) account!: any;

    get msg() {
      const _odds = this.dialogData.odds;
      return `This odds ${this.dialogData.odds.teamSelected} ${_odds.odds} with ${_odds.stake} ETH will be cancelled.`
    }

    closeDialog() {
      this.$emit('close-dialog', DIALOG_NAME.ODDS_CANCEL)
    }

    cancelMyOdds() {
      const _oddsObj = {
        account: this.account.address,
        matchId: this.dialogData.matchId,
        bettingId: this.dialogData.odds.id
      }

      this.cancelOdds(_oddsObj)
    }
  }
</script>