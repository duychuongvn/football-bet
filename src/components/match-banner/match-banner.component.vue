<template src="./match-banner.component.html"></template>
<style lang="scss" scoped src="./match-banner.component.scss"></style>

<script lang="ts">
  import { Component, Vue, Prop } from 'vue-property-decorator';
  import { Action } from 'vuex-class';

  import { DIALOG_NAME } from '@/shared/enums/dialog';

  import * as moment from 'moment';

  @Component({
    components: {
      'flip-countdown': () => import('@/components/flip-countdown/flip-countdown.component.vue')
    }
  })
  export default class MatchBannerComponent extends Vue {
    @Prop() match!: any;

    @Action('openDialog', { namespace: 'dialog' }) openDialog: any;
    @Action('setInitData', { namespace: 'dialog' }) setInitData: any;

    createBet() {
      if (this.match.isGoLive) {
        return;
      }

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
