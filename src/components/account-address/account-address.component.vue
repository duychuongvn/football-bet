<template src="./account-address.component.html"></template>

<script lang="ts">
  import { Component, Vue, Prop } from 'vue-property-decorator';
  import ENV from '@/environment';

  @Component
  export default class AccountAddressComponent extends Vue {
    @Prop() private address!: string;
    @Prop() private isFull!: boolean;

    get isAccountFull () {
      return !!this.isFull;
    }

    get account() {
      let accAddr = this.address;

      if (!this.isAccountFull) {
        const firstString = this.address.substring(0, 10);
        const lastString = this.address.slice(-4);

        accAddr = `${firstString}...${lastString}`;
      }

      return accAddr;
    }

    get linkAccount() {
      return `${ENV.WALLET_ADDRESS}${this.address}`;
    }
  }
</script>
