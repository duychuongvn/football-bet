<template src="./default.component.html"></template>

<script lang="ts">
  import { Component, Vue } from 'vue-property-decorator';

  @Component
  export default class Default extends Vue {
    created () {
      window.addEventListener('beforeunload', () => {
        localStorage.removeItem('bether_time');
      });
    }
  }
</script>
