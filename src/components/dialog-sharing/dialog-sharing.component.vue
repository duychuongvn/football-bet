<template src="./dialog-sharing.component.html"></template>

<script lang="ts">
  import { Component, Vue, Watch } from 'vue-property-decorator';
  import { Getter, Action } from 'vuex-class'
  import { DIALOG_NAME } from '@/shared/enums/dialog';

  @Component
  export default class DialogSharingComponent extends Vue {
    @Action('notify', { namespace: 'notify' }) notify: any

    @Getter('isSharingBetting', { namespace: 'dialog' }) isSharingBetting!: boolean;
    @Getter('initData', { namespace: 'dialog' }) initData: any

    public sharePath: string = '';

    public matchKey: string = '';

    get isDialog() {
      if (this.initData) {
        this.matchKey = btoa(JSON.stringify({
          homeTeam: this.initData.homeTeam,
          awayTeam: this.initData.awayTeam,
          date: this.initData.date
        }))

        this.sharePath = `betther.bet/match-details/${this.matchKey}?accept=${this.initData.bettingId}`;
      }
      return this.isSharingBetting;
    }

    set isDialog(v: any) {
      this.$emit('close-dialog', DIALOG_NAME.BETTING_SHARING)
    }

    onCopy() {
      this.notify({
        mode: 'success',
        message: 'Copied your bet link'
      });
    }
  }
</script>