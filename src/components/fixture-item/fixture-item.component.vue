<template src="./fixture-item.component.html"></template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from "vue-property-decorator";
import { Action, Getter } from 'vuex-class';
import { FixtureState } from '@/store/fixture/types';

import { BetherContractService } from '@/shared/services/bether.service';

import { DIALOG_NAME } from '@/shared/enums/dialog';
import { Fixture } from '@/shared/model/fixture';
import { Betting } from '@/shared/model/betting';

@Component
export default class FixtureItemComponent extends Vue {
  @Action('openDialog', { namespace: 'dialog' }) openDialog: any;
  @Getter('fixturesToday', { namespace: 'fixture' }) fixturesToday: any;
  @Getter('fixturesTomorrow', { namespace: 'fixture' }) fixturesTomorrow: any;
  @Getter('fixturesFuture', { namespace: 'fixture' }) fixturesFuture: any;
  @Getter('isAccount', { namespace: 'web3' }) isAccount!: boolean;

  @Prop() public bettingTime!: string;

  public headersTb: Array<Object> = [
    {
      text: '',
      sortable: false,
      value: 'id'
    },
    { text: 'current bets', value: 'homeTeam', align: 'center', sortable: false },
    { text: 'settled', value: 'awayTeam', align: 'center', sortable: false },
    { text: 'open', value: 'date', align: 'center', sortable: false }
  ];

  public rowPerPage: Array<number> = [20,50,100];

  created() {
    this._summaryBet();
  }

  get allFixtures() {
    switch(this.bettingTime) {
      case 'TODAY':
        return this.fixturesToday;
      case 'TOMORROW':
        return this.fixturesTomorrow;
      case 'FUTURE':
        return this.fixturesFuture;
    }
  }

  get isNotMatches () {
    return this.allFixtures.filter((fixture: any) => fixture.bettings.length !== 0).length !== 0;
  }

  get isFuture() {
    return this.bettingTime === 'FUTURE';
  }

  gotoDetails(betting: any) {
    if (!this.isAccount) {
      const _dialogOpts = {
        key: DIALOG_NAME.INSTALL_METAMASK,
        isOpen: true,
        name: 'dialog-install-metamask'
      };

      this.openDialog(_dialogOpts);
    } else {
      this.$router.push({
        name: 'match-details',
        params: {
          key: betting.key
        }
      });
    }
  }

  @Watch('bettingTime')
  getBettingTime(value: any, oldVal: any) {
    this._summaryBet();
  }

  private _summaryBet() {
    const _listIds = this.allFixtures.map((fixture: any) => fixture.bettings.map((betting: Betting) => betting.matchId));

    _listIds.map((ids: Array<string>, key: number) => {
      if (ids.length !== 0) {
        BetherContractService.countBettings(ids).subscribe((matchInfo: any)=>{
          matchInfo.map((match: any) => {
            const _idxBet = this.allFixtures[key].bettings.findIndex((betting: Betting) => betting.matchId === match.matchId);

            if (_idxBet >= 0) {
              this.allFixtures[key].bettings[_idxBet].summary = match;
            }
          });
        });
      }
    });
  }
}
</script>


