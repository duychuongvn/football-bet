<template src="./fixture.component.html"></template>

<script lang="ts">
  import {Component, Vue} from "vue-property-decorator";
  import {Action, Getter} from "vuex-class";

  @Component({
    components: {
      "fixture-item-comp": () => import("@/components/fixture-item/fixture-item.component.vue")
    }
  })
  export default class FixtureComponent extends Vue {
    @Action("fetchFixtures", {namespace: "fixture"}) fetchFixtures: any;
    @Getter("isInit", {namespace: "fixture"}) isInit!: boolean;

    public fixtureTitle: Array<Object> = [
      {
        name: "Today",
        key: "TODAY"
      },
      {
        name: "Tomorrow",
        key: "TOMORROW"
      },
      {
        name: "Future Matches",
        key: "FUTURE"
      }
    ];

    public arrFixtures: Array<Object> = [
      {
        name: "Bundesliga",
        key: "bundesliga"
      },
      {
        name: "UEFA Champions League",
        key: "uefac"
      },
      {
        name: "La Liga",
        key: "laliga"
      },
      {
        name: "Ligue 1",
        key: "lique"
      },
      {
        name: "Seria A",
        key: "serie"
      },
      {
        name: "English Premier League",
        key: "england"
      }
    ];

    public betTime: string | null = "TODAY";

    public tabsSelected: number = 0;

    created() {
      if (!this.isInit) {
        this.arrFixtures.map((item: Object) => {
          this.fetchFixtures(item);
        });
      }

      if (localStorage.getItem("bether_time")) {
        this.betTime = localStorage.getItem("bether_time");
      }

      this.tabsSelected = this.fixtureTitle.findIndex((title: any) => title.key === this.betTime);
    }

    changedTimeBet(time: string) {
      this.betTime = time;
      localStorage.setItem("bether_time", time);
    }
  }
</script>

