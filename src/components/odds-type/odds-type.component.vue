<template src="./odds-type.component.html"></template>

<script lang="ts">
import { Component, Vue, Watch } from "vue-property-decorator";
import { Action, Getter } from 'vuex-class';

import { USER_TYPE_OPEN, USER_TYPE_FINISHED } from '@/shared/enums/odds';

@Component
export default class OddsTypeComponent extends Vue {
  @Action('totalOdds', { namespace: 'odds' }) totalOdds: any;
  @Action('oddsFilter', { namespace: 'odds' }) oddsFilter: any;
  @Action('filterOdds', { namespace: 'odds' }) filterOdds: any;
  @Getter('oddsCancel', { namespace: 'odds' }) oddsCancel: any;

  @Getter('account', { namespace: 'web3' }) account: any;
  @Getter('isAccount', { namespace: 'web3' }) isAccount: any;

  public oddsTitle: Array<Object> = [
    {
      name: 'Open Matches',
      key: 'OPEN',
      active: true
    },
    {
      name: 'Finished Matches',
      key: 'FINISHED',
      active: false
    }
  ];

  public oddsTypeSelected: string = 'OPEN';

  public selectedFilter: string = Object.keys(USER_TYPE_OPEN)[0]

  created() {
    if (this.account && this.account.address) {
      this.totalOdds(this.account.address);
    }
  }

  @Watch('oddsTypeSelected')
  getOddsType(value: string, oldValue: string) {
    if (value !== oldValue) {
      this.selectedFilter = Object.keys(USER_TYPE_OPEN)[0]
    }
  }

  @Watch('isAccount')
  getAccount(value: string, oldValue: string) {
    if (value) {
      this.totalOdds(this.account.address);
    }
  }

  @Watch('oddsCancel')
  getOddsCancel(value: any, oldValue: any) {
    if (value !== undefined) {
      this.totalOdds(this.account.address);
    }
  }

  get isOddsOpen(): boolean {
    return this.oddsTypeSelected === "OPEN";
  }

  get listFilter(): Array<Object> {
    const resultFilter: Array<Object> = [];
    let _filterType: any = USER_TYPE_OPEN;

    if (!this.isOddsOpen) {
      _filterType = USER_TYPE_FINISHED;
    }

    for(let i in _filterType) {
      resultFilter.push({
        key: i,
        name: this.capitalizeFirstLetter(_filterType[i]),
        number: "+99"
      })
    }

    return resultFilter;
  }

  capitalizeFirstLetter(string: string): string {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  isActiveFilter(key: any): boolean {
    return this.selectedFilter === key;
  }

  changedFilter(key: any): void {
    if (key === this.selectedFilter) return;
    this.selectedFilter = key;
    this.filterOdds(this.selectedFilter)
  }

  selectOddsType(key: string) {
    if (key === this.oddsTypeSelected) return;

    this.oddsTitle.filter((item: any) => {
      item.active = false

      if (item.key === key) {
        item.active = true
      }
    });

    this.oddsTypeSelected = key;
    this.changedFilter(Object.keys(USER_TYPE_OPEN)[0])
  }
}
</script>