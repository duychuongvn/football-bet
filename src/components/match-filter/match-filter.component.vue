<template src="./match-filter.component.html"></template>

<script lang="ts">
  import { Component, Vue } from 'vue-property-decorator';
  import { USER_TYPE_OPEN } from '@/shared/enums/odds';

  @Component
  export default class MatchFilterComponent extends Vue {
    public selectedFilter: string = Object.keys(USER_TYPE_OPEN)[0]
    public bettingSearch: string = '';

    get listFilter(): Array<Object> {
      const resultFilter: Array<Object> = [];
      let _filterType: any = USER_TYPE_OPEN;

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
      this.selectedFilter = key;
    }
  }
</script>