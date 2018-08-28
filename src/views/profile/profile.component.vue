<template src="./profile.component.html"></template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

@Component({
  components: {
    'odds-filter': () => import('@/components/odds-filter/odds-filter.component.vue'),
    'odds-type': () => import('@/components/odds-type/odds-type.component.vue'),
    'odds-result': () => import('@/components/odds-result/odds-result.component.vue')
  }
})
export default class ProfilePage extends Vue {
  public isLoading = true;

  created() {
    setTimeout(() => {
      this.isLoading = false;
    }, 5000);
  }
}
</script>
