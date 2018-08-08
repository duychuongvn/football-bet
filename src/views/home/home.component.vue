<template src="./home.component.html"></template>

<script lang="ts">
  import { Component, Vue } from 'vue-property-decorator'

  @Component({
    components: {
      'introduct-comp': () => import('@/components/introduct/introduct.component.vue'),
      'fixture-comp': () => import('@/components/fixture/fixture.component.vue')
    },
  })
  export default class HomePage extends Vue {}
</script>