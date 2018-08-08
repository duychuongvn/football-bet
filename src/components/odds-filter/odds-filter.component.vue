<template src="./odds-filter.component.html"></template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

@Component
export default class OddsFilterComponent extends Vue {
  public recommendMatch: Array<Object> = [
    {
      id: 1,
      name: "brazil - mexico"
    },
    {
      id: 2,
      name: "sweden - switzerland"
    },
    {
      id: 3,
      name: "colombia - england"
    },
    {
      id: 4,
      name: "colombia1 - england1"
    }
  ];
}
</script>