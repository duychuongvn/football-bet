<template src="./home.component.html"></template>

<script lang="ts">
  import { Component, Vue } from 'vue-property-decorator'
  import { Getter, Action } from 'vuex-class'

  @Component({
    components: {
      'introduct-comp': () => import('@/components/introduct/introduct.component.vue'),
      'fixture-comp': () => import('@/components/fixture/fixture.component.vue')
    },
  })
  export default class HomePage extends Vue {
    @Getter('firebase', { namespace: 'firebase' }) firebase: any;
    // @Getter('firebaseAdmin', { namespace: 'firebase' }) firebaseAdmin: any;

    @Action('sendNotify', { namespace: 'firebase' }) sendNotify: any;

    created() {
      this.sendNotify();
    }
  }
</script>
