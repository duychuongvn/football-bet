<template src="./header.component.html"></template>

<script lang="ts">
  import { Component, Vue , Watch} from 'vue-property-decorator';

  import { Action, Getter } from 'vuex-class';

  import { DIALOG_NAME } from '@/shared/enums/dialog';

  import { BetherContractService } from '@/shared/services/bether.service';

  import * as moment from 'moment';

  @Component
  export default class HeaderComponent extends Vue {
    // Init Vuex
    @Action('getNetwork', { namespace: 'web3' }) getNetwork: any;
    @Action('getAccount', { namespace: 'web3' }) getAccount: any;
    @Getter('web3Init', { namespace: 'web3' }) web3Init: any;
    @Getter('isAccount', { namespace: 'web3' }) isAccount!: boolean;
    @Getter('isNetwork', { namespace: 'web3' }) isNetwork!: boolean;

    @Action('openDialog', { namespace: 'dialog' }) openDialog: any;

    @Action('userSummary', { namespace: 'solobet' }) getUserSummary: any;
    @Getter('bether', { namespace: 'solobet' }) bether: any;
    @Getter('userSummary', { namespace: 'solobet' }) userSummary: any;

    public isFixed: boolean = false;
    private isAuthRoute: Array<string> = ['profile', 'match-details', 'bether-manager'];

    public volumnEth: any = {
      eth_24h: 0,
      eth_7d: 0
    };

    created() {
      this.initWeb3Metamask();

      window.addEventListener('scroll', this.handleScroll);
    }

    initWeb3Metamask() {
      if (this.web3Init.web3) {
        this.getNetwork();

        if (!this.isNetwork) {
          this.$router.push({ name: 'home' });
        }

        if (this.web3Init.account && !!this.web3Init.account.address) {
          this.getAccount();
          this.fetchAccountSummary(this.web3Init.account.address);
        }

        setInterval(() => {
          this.fetchVolumn(moment().add(-1, 'd').unix());
          this.fetchVolumn(moment().add(-7, 'd').unix(), false);
        }, 4000);

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
      return this.web3Init.network.networkName;
    }

    get accountAddr(): string {
      return this.web3Init.account.address;
    }

    get accountBalance(): string {
      return this.web3Init.account.balance ? `${this.web3Init.web3.utils.fromWei(`${this.web3Init.account.balance}`, 'ether')} ETH` : '0 ETH';
    }

    get avatarMMask(): string {
      return this.web3Init.network.avatar;
    }

    get userInfo() {
      return !!this.userSummary ? this.userSummary: '';
    }

    get volumn24hrs () {
      return `${this.volumnEth.eth_24h} ETH`;
    }

    get volumn7days () {
      return `${this.volumnEth.eth_7d} ETH`;
    }

    handleScroll() {
      this.isFixed = (window.scrollY > 45);
    }

    fetchAccountSummary(address: any) {
      if (this.bether && !!this.bether.address) {
        this.getUserSummary(address);
      }
    }

    fetchVolumn(date: number, type: boolean = true) {
      const _currentTime = moment().add(-1, 'd').unix();
      BetherContractService.getVolume(date)
        .subscribe((res: any) => {
          if (type) {
            this.volumnEth.eth_24h = res
          } else {
            this.volumnEth.eth_7d = res;
          }
        })
    }

    goToPages(pageName: string, status: boolean = true) {
      if (!status && !this.isNetwork) {
        const _dialogOpts = {
          key: DIALOG_NAME.IS_NETWORK,
          isOpen: true,
          name: 'dialog-networks'
        };

        this.openDialog(_dialogOpts);
        return;
      }
      this.$router.push({ name: pageName });
    }
  }
</script>
