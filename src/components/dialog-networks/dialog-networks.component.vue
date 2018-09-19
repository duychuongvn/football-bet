<template src="./dialog-networks.component.html"></template>

<script lang="ts">
  import { Component, Vue } from 'vue-property-decorator';
  import { Getter } from 'vuex-class';

  import { DIALOG_NAME } from '@/shared/enums/dialog';

  @Component
  export default class DialogNetWorkComponent extends Vue {
    @Getter('isNetwork', { namespace: 'dialog' }) isNetwork!: boolean;

    closeDialog() {
      this.$emit('close-dialog', DIALOG_NAME.IS_NETWORK)
    }
  }
</script>
