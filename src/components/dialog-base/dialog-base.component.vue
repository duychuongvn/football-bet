<template src="./dialog-base.component.html"></template>

<script lang="ts">
  import { Component, Vue, Watch } from 'vue-property-decorator';
  import { Getter, Action } from 'vuex-class'

  @Component
  export default class DialogHowItWorkComponent extends Vue {
    @Action('openDialog', { namespace: 'dialog' }) openDialog: any;

    @Getter('dialogName', { namespace: 'dialog' }) dialogName!: boolean;

    get componentInstance () {
      return this.dialogName ? () => import(`@/components/${this.dialogName}/${this.dialogName}.component.vue`) : '';
    }

    closeDialog(dialogName: string) {
      this.openDialog({
        key: dialogName,
        isOpen: false
      });
    }
  }
</script>
