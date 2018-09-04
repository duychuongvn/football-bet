<template src="./admin.component.html"></template>

<script lang="ts">
  import { Component, Vue } from "vue-property-decorator";
  import { Getter, Action } from 'vuex-class'

  import * as moment from 'moment';

  @Component
  export default class AdminPage extends Vue {
    @Action('initContract', { namespace: 'solobet' }) initContract: any;
    @Action('updateScore', { namespace: 'solobet' }) updateScore: any;
    @Action('approveScore', { namespace: 'solobet' }) approveScore: any;
    @Action('matches', { namespace: 'solobet' }) matches: any;

    @Getter('matches', { namespace: 'solobet' }) allMatches: any;
    @Getter('account', { namespace: 'web3' }) account: any;

    public homeGoals: string = '';
    public awayGoals: string = '';
    public matchId: any = null;

    created() {
      this.matches();
    }

    get isAccount(): boolean {
      return !!(this.account && this.account.address)
    }

    get allBetting() {
      if (!this.allMatches) return;
      this.allMatches.filter((betting: any) => {
        betting.matchName = `${betting.homeTeam} ~ ${betting.awayTeam}`;
      });

     return this.allMatches;
    }

    get match(): any {
      return this.allMatches.find((betting: any) => betting.matchId === this.matchId)
    }

    get matchDate(): string {
      return moment(this.match.time).format('LL [(]dddd[)] HH:mm a')
    }

    get homeTeamFlag(): string {
      return this.match.homeTeamFlag
    }

    get homeTeam(): string {
      return this.match.homeTeam
    }

    get awayTeamFlag(): string {
      return this.match.awayTeamFlag;
    }

    get awayTeam(): string {
      return this.match.awayTeam
    }

    updateScoreMatch() {
      const _scoreObj = {
        matchId: this.match.matchId,
        homeScore: this.homeGoals,
        awayScore: this.awayGoals,
        account: this.account.address
      };

      this.updateScore(_scoreObj);
    }

    approveScoreMatch() {
      const _scoreObj = {
        matchId: this.match.matchId,
        account: this.account.address
      };

      this.approveScore(_scoreObj);
    }
  }
</script>
