<template src="./admin.component.html"></template>

<script lang="ts">
  import { Component, Vue, Watch } from "vue-property-decorator";
  import { Getter, Action } from 'vuex-class'

  import { Web3Vue } from '@/shared/services/web3.service';
  import * as moment from 'moment';

  @Component
  export default class AdminPage extends Vue {
    @Action('initContract', { namespace: 'solobet' }) initContract: any;
    @Action('updateScore', { namespace: 'solobet' }) updateScore: any
    @Action('approveScore', { namespace: 'solobet' }) approveScore: any
    @Action('matches', { namespace: 'solobet' }) matches: any

   // @Action('fetchFixtures', { namespace: 'fixture' }) fetchFixtures: any;
    @Getter('allFixtures', { namespace: 'fixture' }) allFixtures: any;

    @Getter('account', { namespace: 'web3' }) account: any

    public items: Array<string> = ['Foo', 'Bar', 'Fizz', 'Buzz']
    public homeGoals: string = '';
    public awayGoals: string = '';
    public matchId: any = null;

    created() {
    //  this.fetchFixtures();
      this.initContract();
     this.matches();
    }

    get isAccount(): boolean {
      return !!(this.account && this.account.address)
    }

    get allBetting() {
      const _allBetting: Array<Object> = []
      // this.allFixtures[0].bettings.map((betting: any) => {
      //   const _date = moment(betting.date, 'YYYY/MM/DD HH:mm').milliseconds() /1000;
      //   const _val = `${betting.homeTeam}${betting.awayTeam}${_date}`;
      //   // betting.matchId = Web3Vue.toSHA3(_val)
      //
      //   _allBetting.push(betting);
      // });

      return _allBetting;
    }

    get match(): any {
      return this.allBetting.find((betting: any) => betting.matchId === this.matchId)
    }

    get matchDate(): string {
      return moment(this.match.date, 'YYYY/MM/DD HH:mm').format('LL [(]dddd[)] HH:mm a')
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
      }

      this.updateScore(_scoreObj)
    }

    approveScoreMatch() {
      const _scoreObj = {
        matchId: this.match.matchId,
        account: this.account.address
      }

      this.approveScore(_scoreObj)
    }



    // @Watch("matches")
    // loadMatches() {
    //
    //  return  this.loadMatches();
    // };
  }
</script>
