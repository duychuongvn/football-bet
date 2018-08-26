<template src="./home.component.html"></template>

<script lang="ts">
  import { Component, Vue } from 'vue-property-decorator';
  import { Action } from 'vuex-class';

  @Component({
    components: {
      'introduct-comp': () => import('@/components/introduct/introduct.component.vue'),
      'fixture-comp': () => import('@/components/fixture/fixture.component.vue')
    },
  })
  export default class HomePage extends Vue {
    @Action('checkInit', { namespace: 'fixture' }) checkInit: any;

    destroyed() {
      this.checkInit(true);
    }
  }
</script>
