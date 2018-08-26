<template src="./dialog-sharing.component.html"></template>

<script lang="ts">
  import { Component, Vue, Watch } from 'vue-property-decorator';
  import { Getter, Action } from 'vuex-class'
  import { DIALOG_NAME } from '@/shared/enums/dialog';

  import ENV from '@/environment/index'

  @Component
  export default class DialogSharingComponent extends Vue {
    @Action('notify', { namespace: 'notify' }) notify: any

    @Getter('isSharingBetting', { namespace: 'dialog' }) isSharingBetting!: boolean;
    @Getter('initData', { namespace: 'dialog' }) initData: any;

    public sharePath: string = '';

    public matchKey: string = '';

    get isDialog() {
      if (this.initData) {
        this.matchKey = btoa(JSON.stringify({
          homeTeam: this.initData.homeTeam,
          awayTeam: this.initData.awayTeam,
          date: this.initData.date
        }));

        this.sharePath = `${ENV.DOMAIN}/match-details/${this.matchKey}?accept=${this.initData.bettingId}`;
      }
      return this.isSharingBetting;
    }

    set isDialog(v: any) {
      this.$emit('close-dialog', DIALOG_NAME.BETTING_SHARING)
    }

    get isSocial() {
      return this.initData && this.initData.key === DIALOG_NAME.SHARING_SOCIAL;
    }

    get message() {
      if (this.initData && this.initData.message) {
        return this.initData.message;
      }
      return '';
    }

    onCopy() {
      this.notify({
        mode: 'success',
        message: 'Copied your bet link'
      });
    }
  }
</script>
