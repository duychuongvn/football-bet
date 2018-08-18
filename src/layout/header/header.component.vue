<template src="./header.component.html"></template>

<script lang="ts">
  import { Component, Vue } from 'vue-property-decorator';

  import { Action, Getter } from 'vuex-class';

  @Component
  export default class HeaderComponent extends Vue {
    // Init Vuex
    @Action('initContract', { namespace: 'solobet' }) initContract: any;

    @Action('registerWeb3', { namespace: 'web3' }) registerWeb3: any;
    @Action('getNetwork', { namespace: 'web3' }) getNetwork: any;
    @Action('getAccount', { namespace: 'web3' }) getAccount: any;
    @Getter('web3Init', { namespace: 'web3' }) web3Init: any;
    @Getter('isAccount', { namespace: 'web3' }) isAccount!: boolean;

    public isFixed: boolean = false;
    private isAuthRoute: Array<string> = ['profile', 'match-details', 'bether-manager'];

    created() {
      this.initWeb3Metamask();

      window.addEventListener('scroll', this.handleScroll);
    }

    initWeb3Metamask() {
      this.registerWeb3();

      if (this.web3Init.web3) {
        this.getNetwork();

        if (this.web3Init.account && !!this.web3Init.account.address) {
          this.getAccount();
        }

        this.initContract(this.web3Init.web3.currentProvider)

        this.web3Init.web3.currentProvider.publicConfigStore.subscribe((item: any) => {
          if (item.selectedAddress) {
            this.web3Init.account.address = item.selectedAddress;
            this.getAccount();
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

    handleScroll() {
      this.isFixed = (window.scrollY > 45);
    }
  }
</script>
