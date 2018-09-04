<template src="./profile.component.html"></template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator';
import { Action, Getter } from 'vuex-class';

@Component({
  components: {
    'odds-filter': () => import('@/components/odds-filter/odds-filter.component.vue'),
    'odds-type': () => import('@/components/odds-type/odds-type.component.vue'),
    'odds-result': () => import('@/components/odds-result/odds-result.component.vue')
  }
})
export default class ProfilePage extends Vue {
  @Action('totalOdds', { namespace: 'odds' }) totalOdds: any;

  @Getter('account', { namespace: 'web3' }) account: any;
  @Getter('isAccount', { namespace: 'web3' }) isAccount: any;

  public isLoading = true;

  created() {
    if (this.account && this.account.address) {
      this.totalOdds(this.account.address);
    }

    setTimeout(() => {
      this.isLoading = false;
    }, 5000);
  }

  @Watch('isAccount')
  getAccount(value: string, oldValue: string) {
    if (value) {
      this.totalOdds(this.account.address);
    }
  }
}
</script>
