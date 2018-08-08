<template src="./dialog-how-it-works.component.html"></template>

<script lang="ts">
  import { Component, Vue, Watch } from 'vue-property-decorator';
  import { Getter } from 'vuex-class'
  import { DIALOG_NAME } from '@/shared/enums/dialog';

  @Component
  export default class DialogHowItWorkComponent extends Vue {
    @Getter('isHowItWork', { namespace: 'dialog' }) isHowItWork!: boolean;

    get isDialog() {
      return this.isHowItWork;
    }

    set isDialog(v: any) {
      this.$emit('close-dialog', DIALOG_NAME.HOW_IT_WORKS)
    }
  }
</script>