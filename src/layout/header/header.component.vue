<template src="./header.component.html"></template>

<script lang="ts">
  import { Component, Vue , Watch} from 'vue-property-decorator';

  import { Action, Getter } from 'vuex-class';

  @Component
  export default class HeaderComponent extends Vue {
    // Init Vuex
    @Action('getNetwork', { namespace: 'web3' }) getNetwork: any;
    @Action('getAccount', { namespace: 'web3' }) getAccount: any;
    @Getter('web3Init', { namespace: 'web3' }) web3Init: any;
    @Getter('isAccount', { namespace: 'web3' }) isAccount!: boolean;

    @Action('userSummary', { namespace: 'solobet' }) getUserSummary: any;
    @Getter('bether', { namespace: 'solobet' }) bether: any;
    @Getter('userSummary', { namespace: 'solobet' }) userSummary: any;

    public isFixed: boolean = false;
    private isAuthRoute: Array<string> = ['profile', 'match-details', 'bether-manager'];

    created() {
      this.initWeb3Metamask();

      window.addEventListener('scroll', this.handleScroll);
    }

    initWeb3Metamask() {
      if (this.web3Init.web3) {
        this.getNetwork();

        if (this.web3Init.account && !!this.web3Init.account.address) {
          this.getAccount();
          this.fetchAccountSummary(this.web3Init.account.address);
        }

        this.web3Init.web3.currentProvider.publicConfigStore.subscribe((item: any) => {
          if (item.selectedAddress) {
            this.web3Init.account.address = item.selectedAddress;
            this.getAccount();
            this.fetchAccountSummary(item.selectedAddress);
          } else {
            this.web3Init.account.address = undefined;
            this.web3Init.account.balance = 0;

            if (this.isAuthRoute.indexOf(`${this.$route.name}`) !== -1) {
              this.$router.push({ name: 'home' });
            }
          }
        });
      }
    }
    // Computed
    get networkName(): string {
      return this.web3Init.account.networkId;
    }

    get accountAddr(): string {
      return this.web3Init.account.address;
    }

    get accountBalance(): string {
      return `${+this.web3Init.account.balance} ETH`;
    }

    get avatarMMask(): string {
      return this.web3Init.account.avatar;
    }

    get userInfo() {
      return !!this.userSummary ? this.userSummary: '';
    }

    handleScroll() {
      this.isFixed = (window.scrollY > 45);
    }

    fetchAccountSummary(address: any) {
      if (this.bether && !!this.bether.address) {
        this.getUserSummary(address);
      }
    }
  }
</script>
