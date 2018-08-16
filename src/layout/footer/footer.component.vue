<template src="./footer.component.html"></template>

<script lang="ts">
  import { Component, Vue } from 'vue-property-decorator'

  @Component
  export default class FooterComponent extends Vue {
    private socialIcons: Array<Object> = [
      {
        color: 'blue darken-3',
        name: 'fab fa-telegram-plane',
        tooltip: 'telegram'
      },
      {
        color: 'light-blue darken-1',
        name: 'fab fa-twitter',
        tooltip: 'Twitter'
      },
      {
        color: 'blue-grey darken-3',
        name: 'fab fa-github',
        tooltip: 'Github'
      },
      {
        color: 'teal lighten-1',
        name: 'fas fa-envelope',
        tooltip: 'Support',
        mailto: 'mailto:info@bether.bet'
      }
    ]
  }
</script>
