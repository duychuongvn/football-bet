<template src="./dialog-start-loading.component.html"></template>

<script lang="ts">
  import { Component, Vue } from 'vue-property-decorator'
  import { Getter } from 'vuex-class'

  import { DIALOG_NAME } from '@/shared/enums/dialog'

  @Component
  export default class DialogStartLoadingComponent extends Vue {
    @Getter('isStartLoading', { namespace: 'dialog' }) isStartLoading!: boolean;

    created() {
      setTimeout(() => {
        this.$emit('close-dialog', DIALOG_NAME.START_LOADING)
      }, 3000);
    }
  }
</script>