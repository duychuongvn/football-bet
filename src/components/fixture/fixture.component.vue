<template src="./fixture.component.html"></template>

<script lang="ts">
  import { Component, Vue } from 'vue-property-decorator';
  import { Action } from 'vuex-class';

  @Component({
    components: {
      'fixture-item-comp': () => import('@/components/fixture-item/fixture-item.component.vue')
    }
  })
  export default class FixtureComponent extends Vue {
    @Action('fetchFixtures', { namespace: 'fixture' }) fetchFixtures: any;

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

    public arrFixtures: Array<Object> = [
      {
        name: 'UEFA Champions League',
        key: 'uefac'
      },
      {
        name: 'La Liga',
        key: 'laliga'
      },
      {
        name: 'Ligue 1',
        key: 'lique'
      },
      {
        name: 'Seria A',
        key: 'serie'
      },
      {
        name: 'English Premier League',
        key: 'england'
      },
      {
        name: 'Bundesliga',
        key: 'bundesliga'
      }
    ]

    public betTime: string = 'TODAY';

    created() {
      this.arrFixtures.map((item: Object) => {
        this.fetchFixtures(item);
      });
    }

    changedTimeBet(time: string) {
      this.betTime = time;
    }
  }
</script>

