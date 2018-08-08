<template src="./fixture-item.component.html"></template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
import { Action, Getter } from 'vuex-class';
import { FixtureState } from '@/store/fixture/types';

import { DIALOG_NAME } from '@/shared/enums/dialog';

import { api } from '@/shared/services/api.service';

@Component
export default class FixtureItemComponent extends Vue {
  @Action('fetchFixtures', { namespace: 'fixture' }) fetchFixtures: any;
  @Action('openDialog', { namespace: 'dialog' }) openDialog: any;
  @Getter('allFixtures', { namespace: 'fixture' }) allFixtures: any;
  @Getter('isAccount', { namespace: 'web3' }) isAccount!: boolean

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

  created() {
    this.fetchFixtures();
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
}
</script>


