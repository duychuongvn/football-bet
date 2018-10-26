<template src="./match-banner.component.html"></template>
<style lang="scss" scoped src="./match-banner.component.scss"></style>

<script lang="ts">
  import { Component, Vue, Prop } from 'vue-property-decorator';
  import { Action, Getter } from 'vuex-class';

  import { DIALOG_NAME } from '@/shared/enums/dialog';

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

      let query = Object.assign({}, this.$route.query);
      delete query.accept;
      this.$router.replace({ query });

      this.openDialog(_initOpts);
    }
  }
</script>
