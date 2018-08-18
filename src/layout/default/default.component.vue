<template src="./default.component.html"></template>

<script lang="ts">
  import { Component, Vue } from 'vue-property-decorator';
  import { Action } from 'vuex-class';

  @Component
  export default class Default extends Vue {
    @Action('initFireBase', { namespace: 'firebase' }) initFireBase: any;
    @Action('initFbAdmin', { namespace: 'firebase' }) initFbAdmin: any;

    created() {
      this.initFireBase()
      this.initFbAdmin()
    }
  }
</script>
