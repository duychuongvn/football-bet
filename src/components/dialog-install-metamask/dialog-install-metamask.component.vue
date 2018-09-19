<template src="./dialog-install-metamask.component.html"></template>

<script lang="ts">
  import { Component, Vue } from 'vue-property-decorator'
  import { Getter } from 'vuex-class'

  import { DIALOG_NAME } from '@/shared/enums/dialog'

  @Component
  export default class DialogMetaMaskComponent extends Vue {
    @Getter('isMetaMask', { namespace: 'dialog' }) isMetaMask!: boolean;
    @Getter('web3Init', { namespace: 'web3' }) web3Init!: any;

    get metamaskeTitle() {
      return this.web3Init.injectedWeb3 ? 'Login to MetaMask!' : 'You need to install MetaMask!';
    }

    closeDialog() {
      this.$emit('close-dialog', DIALOG_NAME.INSTALL_METAMASK)
    }
  }
</script>
