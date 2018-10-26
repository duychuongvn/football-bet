<template src="./admin.component.html"></template>

<script lang="ts">
  import { Component, Vue } from "vue-property-decorator";
  import { Getter, Action } from 'vuex-class'
  import { DateTime } from 'luxon';
  import { BetherContractService } from "@/shared/services/bether.service";

  @Component
  export default class AdminPage extends Vue {
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
      const _match = this.allMatches.find((betting: any) => betting.matchId === this.matchId);
      this.homeGoals = _match.homeGoals;
      this.awayGoals = _match.awayGoals;
      return _match;
    }

    get matchDate(): string {
      return DateTime.fromMillis(this.match.time * 1000).toLocaleString(DateTime.DATETIME_MED_WITH_SECONDS);
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
      BetherContractService.updateScore({
        matchId: this.match.matchId,
        homeScore: +this.homeGoals,
        awayScore: +this.awayGoals,
        account: this.account.address
      })
        .subscribe((res: any) => {
          // TODO: handle success
        }, (error: any) => {
          // TODO: handle error
        });
    }

    approveScoreMatch() {
      BetherContractService.approveScore({
        matchId: this.match.matchId,
        account: this.account.address
      })
        .subscribe((res: any) => {
          // TODO: handle success
        }, (error: any) => {
          // TODO: handle error
        });
    }
  }
</script>
