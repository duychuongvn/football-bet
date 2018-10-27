<template src="./matches-details.component.html"></template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator'
import { Action, Getter } from 'vuex-class'

@Component({
  components: {
    'match-banner': () => import('@/components/match-banner/match-banner.component.vue'),
    'match-filter': () => import('@/components/match-filter/match-filter.component.vue'),
    'match-result': () => import('@/components/match-result/match-result.component.vue')
  }
})
export default class MatchesDetailsPage extends Vue {
  @Action('fetchMatch', { namespace: 'matches' }) fetchMatch: any;
  @Getter('match', { namespace: 'matches' }) match!: any;

  @Getter('account', {namespace: 'web3'}) account: any;

  created() {
    if (this.account && this.account.address) {
      this.fetchMatch(JSON.parse(atob(this.$route.params.key)))
    }
  }

  @Watch('account')
  getAccount(value: any, oldValue: any) {
    if (value.address || (oldValue && oldValue.address !== value.address)) {
      this.fetchMatch(JSON.parse(atob(this.$route.params.key)))
    }
  }
}
</script>
