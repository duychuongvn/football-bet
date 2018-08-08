<template src="./match-banner.component.html"></template>

<script lang="ts">
  import { Component, Vue, Prop } from 'vue-property-decorator';
  import { Action } from 'vuex-class'

  import { DIALOG_NAME } from '@/shared/enums/dialog'

  @Component
  export default class MatchBannerComponent extends Vue {
    @Prop() match!: any;

    @Action('openDialog', { namespace: 'dialog' }) openDialog: any
    @Action('setInitData', { namespace: 'dialog' }) setInitData: any

    createBet() {
      const _initOpts = {
        key: DIALOG_NAME.STORE_BETTING,
        isOpen: true,
        name: 'dialog-betting',
        initData: {
          match: this.match
        }
      };

      this.openDialog(_initOpts);
    }
  }
</script>