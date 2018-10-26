<template src="./match-result-punters.component.html"></template>
<style lang="scss" scoped src="./match-result-punters.component.scss"></style>

<script lang="ts">
  import { Component, Vue, Prop } from 'vue-property-decorator';

  @Component
  export default class MatchResultPuntersComponent extends Vue {
    @Prop() punters: any
    @Prop() betting: any
    @Prop() match: any

    created() {}

    get oddsString () {
      const _awayTeamName = typeof this.match.awayTeam === 'object' ? this.match.awayTeam.name : this.match.awayTeam;
      const _homeTeamName = typeof this.match.homeTeam === 'object' ? this.match.homeTeam.name : this.match.homeTeam;

      let _teamName = this.betting.bookmakerTeam === 0 ? _awayTeamName : _homeTeamName;
      let _odds: any = this.betting.odds / 100;

      _odds = _odds > 0 ? `-${_odds}` : `+${-_odds}`;

      return `${_teamName} @${_odds}`;
    }
  }
</script>
