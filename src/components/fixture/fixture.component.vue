<template src="./fixture.component.html"></template>

<script lang="ts">
  import { Component, Vue } from 'vue-property-decorator';

  @Component({
    components: {
      'fixture-item-comp': () => import('@/components/fixture-item/fixture-item.component.vue')
    }
  })
  export default class FixtureComponent extends Vue {
    public fixtureTitle: Array<Object> = [
      {
        name: 'Today',
        key: 'TODAY'
      },
      {
        name: 'Tomorrow',
        key: 'TOMORROW'
      },
      {
        name: 'Future Matches',
        key: 'FUTURE'
      }
    ];

    public betTime: string = 'TODAY';

    changedTimeBet(time: string) {
      this.betTime = time;
    }
  }
</script>

