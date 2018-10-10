<template src="./dialog-sharing.component.html"></template>

<script lang="ts">
  import { Component, Vue } from 'vue-property-decorator';
  import { Getter, Action } from 'vuex-class'
  import { DIALOG_NAME } from '@/shared/enums/dialog';

  const isUndefined = require('lodash/isUndefined');

  @Component
  export default class DialogSharingComponent extends Vue {
    @Action('notify', { namespace: 'notify' }) notify: any

    @Getter('isSharingBetting', { namespace: 'dialog' }) isSharingBetting!: boolean;
    @Getter('initData', { namespace: 'dialog' }) initData: any;

    public sharePath: string = '';

    public matchKey: string = '';

    public isLoading: boolean = false;

    public bettingId: number | undefined;

    get isDialog() {
      if (this.initData) {
        if (this.$route.params && this.$route.params.key) {
          this.matchKey = this.$route.params.key;
        } else {
          this.matchKey = btoa(JSON.stringify({
            id: this.initData.bettingId,
            matchId: this.initData.matchId,
            homeTeam: this.initData.homeTeam,
            awayTeam: this.initData.awayTeam,
            date: this.initData.date
          }));
        }

        if (!isUndefined(this.initData.bettingId)) {
          this.bettingId = this.initData.bettingId;
        }

        if (this.initData.isLoading) {
          this.isLoading = this.initData.isLoading;
        }

        this.sharePath = `${window.location.host}/match-details/${encodeURIComponent(this.matchKey)}?accept=${this.bettingId}`;
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
