<template src="./admin.component.html"></template>

<script lang="ts">
  import { Component, Vue } from "vue-property-decorator";
  import { Getter, Action } from 'vuex-class'

  import * as moment from 'moment';
  import { BetherContractService } from "@/shared/services/bether.service";

  @Component
  export default class AdminPage extends Vue {
    @Action('matches', { namespace: 'solobet' }) matches: any;

    @Getter('matches', { namespace: 'solobet' }) allMatches: any;
    @Getter('account', { namespace: 'web3' }) account: any;

    public homeGoals: number = undefined;
    public awayGoals: number = undefined;
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
      BetherContractService.updateScore({
        matchId: this.match.matchId,
        homeScore: +this.homeGoals,
        awayScore: +this.awayGoals,
        account: this.account.address
      })
        .subscribe((res: any) => {
          console.log(res)
        }, (error: any) => {
          console.log(error)
        });
    }

    approveScoreMatch() {
      BetherContractService.approveScore({
        matchId: this.match.matchId,
        account: this.account.address
      })
        .subscribe((res: any) => {
          console.log(res)
        }, (error: any) => {
          console.log(error)
        });
    }
  }
</script>
